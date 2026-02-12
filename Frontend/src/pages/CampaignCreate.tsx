import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type CampaignFormData = {
  id: number;
  title: string;
  description: string;
  goal_amount: string;
  category: string;
  image_url?: string | null;
  deadline: string;
};

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const CreateCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [category, setCategory] = useState("education");
  const [deadline, setDeadline] = useState("");

  // Image state: File objects + preview URLs
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access");
      const storedUser = localStorage.getItem("user");
      if (!token || !storedUser) {
        navigate("/login");
      } else {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [navigate]);

  // update previews whenever files change
  useEffect(() => {
    // revoke previous preview URLs
    previews.forEach((p) => {
      if (p.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(p);
        } catch {}
      }
    });

    const nextPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((p) => {
        if (p.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(p);
          } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError("Campaign title is required");
      return false;
    }
    if (!description.trim()) {
      setError("Campaign description is required");
      return false;
    }
    if (!goalAmount || parseFloat(goalAmount) <= 0) {
      setError("Goal amount must be greater than 0");
      return false;
    }
    if (!deadline) {
      setError("Deadline is required");
      return false;
    }
    if (new Date(deadline) <= new Date()) {
      setError("Deadline must be in the future");
      return false;
    }
    // image validations
    if (files.length > MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      return false;
    }
    for (const f of files) {
      if (f.size > MAX_FILE_SIZE) {
        setError(`"${f.name}" is too large. Max ${Math.round(MAX_FILE_SIZE / (1024 * 1024))} MB.`);
        return false;
      }
      if (!f.type.startsWith("image/")) {
        setError(`"${f.name}" is not an image file.`);
        return false;
      }
    }
    return true;
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    setError(null);
    if (!fileList) return;
    const selected = Array.from(fileList);
    // append but enforce max
    const combined = [...files, ...selected].slice(0, MAX_IMAGES);
    setFiles(combined);
  };

  const removeFileAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // upload images to Supabase and return public URLs
  const uploadFilesToSupabase = async (campaignId: number): Promise<string[]> => {
    if (files.length === 0) return [];

    const uploadPromises = files.map(async (file) => {
      const ext = file.name.split(".").pop() || "png";
      // use campaignId plus random suffix for path
      const filename = `${crypto.randomUUID?.() ?? Date.now()}.${
        ext
      }`;
      const path = `campaigns/${campaignId}/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from("campaigns")
        .upload(path, file, { upsert: true });
      if (uploadError) {
        throw new Error(uploadError.message || "Upload failed");
      }
      const { data: publicData } = supabase.storage.from("campaigns").getPublicUrl(path);
      return publicData.publicUrl;
    });

    // run in parallel
    return Promise.all(uploadPromises);
  };

  const attachImagesToCampaign = async (campaignId: number, urls: string[]) => {
    if (urls.length === 0) return;
    const token = localStorage.getItem("access");
    await api.post(
      `/campaigns/${campaignId}/images`,
      { images: urls },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("You are not authenticated.");
        navigate("/login");
        return;
      }

      const isoDeadline = new Date(deadline).toISOString();

      // 1) Create campaign first
      const res = await api.post<CampaignFormData>(
        "/campaigns/create",
        {
          title: title.trim(),
          description: description.trim(),
          goal_amount: parseFloat(goalAmount),
          category,
          image_url: null, // main image not used; we'll attach images separately
          deadline: isoDeadline,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const campaignId = res.data.id;
      toast.success("Campaign created. Uploading images...");

      // 2) Upload files to Supabase
      let imageUrls: string[] = [];
      try {
        imageUrls = await uploadFilesToSupabase(campaignId);
      } catch (uploadErr: any) {
        console.error("Image upload error", uploadErr);
        toast.error("Some images failed to upload. You can retry from the campaign page.");
      }

      // 3) Attach image URLs to campaign via backend
      if (imageUrls.length > 0) {
        await attachImagesToCampaign(campaignId, imageUrls);
      }

      toast.success("Campaign created successfully!");
      navigate("/student");
    } catch (err: any) {
      console.error("Error creating campaign", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to create campaign. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create a Campaign</h1>
          <p className="text-muted-foreground">Start a fundraising campaign for your educational goals.</p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Tell us about your fundraising campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input id="title" placeholder="e.g., Help fund my college tuition" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
                <p className="text-xs text-muted-foreground">{title.length}/200</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea id="description" placeholder="Tell your story..." value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={6} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-xs text-muted-foreground">{description.length}/2000</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="goal-amount">Funding Goal (USD) *</Label>
                  <Input id="goal-amount" type="number" placeholder="e.g., 5000" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} min="1" step="0.01" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="education">Education</option>
                    <option value="tuition">Tuition</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="student_loans">Student Loans</option>
                    <option value="living_expenses">Living Expenses</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Multiple image upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Campaign Images (optional, up to {MAX_IMAGES})</Label>
                <input id="images" type="file" accept="image/*" multiple onChange={(e) => handleFilesSelected(e.target.files)} />
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {previews.map((src, i) => (
                    <div key={src} className="relative">
                      <img src={src} alt={`preview-${i}`} className="h-24 w-full object-cover rounded-md" />
                      <button type="button" onClick={() => removeFileAt(i)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Campaign Deadline *</Label>
                <Input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Campaign..." : "Create Campaign"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaign;