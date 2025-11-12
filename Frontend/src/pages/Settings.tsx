import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/axios";
import { toast } from "sonner";

type StudentProfile = {
  id: number;
  full_name: string;
  email: string;
  bio?: string | null;
  university?: string | null;
  major?: string | null;
  academic_year?: string | null;
  gpa?: string | number | null;
};

const Settings = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); // usually read-only
  const [bio, setBio] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [gpa, setGpa] = useState<string>("");

  // load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setLoading(false);
          return;
        }

        // This assumes you have GET /auth/profile/ wired to get_my_profile (or similar)
        const res = await api.get<StudentProfile>("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const p = res.data;
        setFullName(p.full_name || user?.name || "");
        setEmail(p.email || user?.email || "");
        setBio((p.bio as string) || "");
        setUniversity(p.university || "");
        setMajor(p.major || "");
        setAcademicYear(p.academic_year || "");
        setGpa(p.gpa !== null && p.gpa !== undefined ? String(p.gpa) : "");
      } catch (err) {
        console.error("Error loading profile", err);
        setProfileError("Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("You are not authenticated.");
        return;
      }

      // Send updated profile to backend
      await api.put(
        "/auth/profile",
        {
          full_name: fullName,
          bio,
          university,
          major,
          academic_year: academicYear,
          gpa: gpa ? parseFloat(gpa) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
          {loading && (
            <p className="text-sm text-muted-foreground mt-2">
              Loading profile…
            </p>
          )}
          {profileError && (
            <p className="text-sm text-destructive mt-2">
              {profileError}
            </p>
          )}
        </div>

        <Separator />

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your profile information and academic details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* ✅ Academic info fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  placeholder="e.g. Arizona State University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  placeholder="e.g. Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic-year">Academic Year</Label>
                <Input
                  id="academic-year"
                  placeholder="e.g. Junior"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
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

            <Button onClick={handleUpdateProfile} disabled={loading}>
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings – unchanged */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your campaigns and donations.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your device.
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Communications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and updates.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings – unchanged */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>
              Control your privacy and data sharing preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile visible to other users.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Donation History</Label>
                <p className="text-sm text-muted-foreground">
                  Display your donation history on your profile.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions – unchanged */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account settings and security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Download Data</Button>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
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
