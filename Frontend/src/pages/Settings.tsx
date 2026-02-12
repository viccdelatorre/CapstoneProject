import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/axios";
import { toast } from "sonner";

type StudentProfile = {
  id: number;
  full_name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  university?: string | null;
  major?: string | null;
  academic_year?: string | null;
  gpa?: string | number | null;
};

type DonorProfile = {
  id: number;
  full_name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  organization?: string | null;
};

const Settings = () => {
  const { user, setUser } = useAuth();

  const rolesArray = user?.roles ?? [];
  const isDonor = rolesArray.includes("donor");
  const isStudent = rolesArray.includes("student");

  // Avatar state: previewUrl is the currently shown preview (may be blob or hosted URL)
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const previewUrlRef = useRef<string | null>(null); // used to revoke blob URLs reliably
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true); // for initial load
  const [isSaving, setIsSaving] = useState(false); // for update action
  const [profileError, setProfileError] = useState<string | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [organization, setOrganization] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [gpa, setGpa] = useState<string>("");

  // fetch profile on mount (cancellable)
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        if (!mounted) return;
        const data: Partial<StudentProfile & DonorProfile> = res.data ?? {};
        setFullName(data.full_name ?? "");
        setEmail(data.email ?? "");
        setBio(data.bio ?? "");
        const avatarVal = data.avatar ?? "";
        setPreviewUrl(avatarVal || "");
        previewUrlRef.current = undefined; // hosted URL - no revoke needed
        if (isDonor) {
          setOrganization((data as DonorProfile).organization ?? "");
        } else {
          setUniversity((data as StudentProfile).university ?? "");
          setMajor((data as StudentProfile).major ?? "");
          setAcademicYear((data as StudentProfile).academic_year ?? "");
          setGpa((data as StudentProfile).gpa != null ? String((data as StudentProfile).gpa) : "");
        }
      } catch (err: any) {
        console.error("fetch profile error", err);
        if (!mounted) return;
        setProfileError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
      // cleanup any blob URL created for preview
      if (previewUrlRef.current && previewUrlRef.current.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch (e) {
          /* ignore */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional empty — fetch on mount

  const handleFileChange = (file?: File | null) => {
    // revoke previous preview if it was a blob
    if (previewUrlRef.current && previewUrlRef.current.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch (e) {
        /* ignore */
      }
      previewUrlRef.current = null;
    }

    if (!file) {
      setAvatarFile(null);
      setPreviewUrl("");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    previewUrlRef.current = blobUrl;
    setAvatarFile(file);
    setPreviewUrl(blobUrl);
  };

  const validateBeforeSave = (): string | null => {
    if (!fullName.trim()) return "Full name is required.";
    if (isStudent && gpa) {
      const n = Number(gpa);
      if (Number.isNaN(n)) return "GPA must be a number.";
      if (n < 0 || n > 4) return "GPA must be between 0.0 and 4.0.";
    }
    return null;
  };

  const handleUpdateProfile = async () => {
    const clientValidation = validateBeforeSave();
    if (clientValidation) {
      toast.error(clientValidation);
      return;
    }

    setIsSaving(true);
    try {
      let finalAvatar: string | null = previewUrl || null;

      if (avatarFile) {
        const { data: getUserData, error: getUserErr } = await supabase.auth.getUser();
        const sbUser = getUserData?.user;
        if (getUserErr || !sbUser) {
          console.error("Could not determine Supabase user for avatar upload", getUserErr);
          toast.error("Upload failed: not authenticated with Supabase.");
          setIsSaving(false);
          return;
        }

        const ext = avatarFile.name.split(".").pop() || "png";
        const path = `${sbUser.id}/avatar.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });

        if (uploadError) {
          console.error("Avatar upload error", uploadError);
          toast.error("Failed to upload avatar. Please try again.");
          setIsSaving(false);
          return;
        }

        const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(path);
        finalAvatar = publicData?.publicUrl ?? null;
      }

      const payload: Partial<StudentProfile & DonorProfile> = {
        full_name: fullName,
        bio: bio || null,
        avatar: finalAvatar ?? null,
      };

      if (isDonor) {
        payload.organization = organization || null;
      } else {
        payload.university = university || null;
        payload.major = major || null;
        payload.academic_year = academicYear || null;
        payload.gpa = gpa ? parseFloat(gpa) : null;
      }

      await api.put("/auth/profile", payload);

      // update context & localStorage
      if (setUser && user) {
        const updated = { ...user, name: fullName, avatar: finalAvatar };
        setUser(updated);
        try {
          localStorage.setItem("user", JSON.stringify(updated));
        } catch (e) {
          // ignore localStorage errors
        }
      }

      // If we used a local blob preview, revoke it now that we have hosted URL
      if (avatarFile && previewUrlRef.current && previewUrlRef.current.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch (e) {
          /* ignore */
        }
        previewUrlRef.current = null;
      }

      // Reset file input so same file can be selected again if user wants
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setAvatarFile(null);
      setPreviewUrl(finalAvatar ?? "");

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err?.response?.status, err?.response?.data || err?.message);
      toast.error(err?.response?.data?.error || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8" aria-busy={loading || isSaving}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
          {loading && (
            <p className="text-sm text-muted-foreground mt-2">Loading profile…</p>
          )}
          {profileError && (
            <p className="text-sm text-destructive mt-2">{profileError}</p>
          )}
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your profile information and academic details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatarFile">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <img
                  src={previewUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    id="avatarFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      handleFileChange(file);
                    }}
                    aria-label="Upload profile picture"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // remove avatar preview and mark for deletion on save (send null)
                        handleFileChange(null);
                        setPreviewUrl("");
                        // Also clear hosted avatar so user can remove existing avatar
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" value={email} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            {isDonor ? (
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" placeholder="e.g. ACME Corp" value={organization} onChange={(e) => setOrganization(e.target.value)} />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input id="university" placeholder="e.g. Arizona State University" value={university} onChange={(e) => setUniversity(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input id="major" placeholder="e.g. Computer Science" value={major} onChange={(e) => setMajor(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academic-year">Academic Year</Label>
                  <Input id="academic-year" placeholder="e.g. Junior" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpa">Current GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="e.g. 3.8"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button onClick={handleUpdateProfile} disabled={loading || isSaving}>
              {isSaving ? "Saving…" : "Update Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications, Privacy, Account remain unchanged */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates about your campaigns and donations.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications on your device.</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Communications</Label>
                <p className="text-sm text-muted-foreground">Receive emails about new features and updates.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Control your privacy and data sharing preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to other users.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Donation History</Label>
                <p className="text-sm text-muted-foreground">Display your donation history on your profile.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings and security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Download Data</Button>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
              <Button variant="destructive" className="mt-2">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;