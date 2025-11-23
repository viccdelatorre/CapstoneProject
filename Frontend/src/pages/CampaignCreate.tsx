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

type CampaignFormData = {
  id: number;
  title: string;
  description: string;
  goal_amount: string;
  category: string;
  image_url?: string | null;
  deadline: string;
};

const CreateCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Form state (same pattern as Settings)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [category, setCategory] = useState("education");
  const [imageUrl, setImageUrl] = useState("");
  const [deadline, setDeadline] = useState("");

  // Redirect if not authenticated after checking
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

  // Validate form
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
    return true;
  };

  // Handle campaign creation (same pattern as Settings update)
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("You are not authenticated.");
        navigate("/login");
        return;
      }

      // Convert deadline to ISO format with timezone
      const deadlineDate = new Date(deadline);
      const isoDeadline = deadlineDate.toISOString();

      // Send campaign data to backend (same format as Settings)
      const response = await api.post<CampaignFormData>(
        "/campaigns/create",
        {
          title: title.trim(),
          description: description.trim(),
          goal_amount: parseFloat(goalAmount),
          category,
          image_url: imageUrl || null,
          deadline: isoDeadline,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Campaign created successfully!");
      navigate("/student");
    } catch (err: any) {
      console.error("Error creating campaign", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to create campaign. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
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
          <p className="text-muted-foreground">
            Start a fundraising campaign for your educational goals.
          </p>
        </div>

        <Separator />

        {/* Campaign Form */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Tell us about your fundraising campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Help fund my college tuition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">{title.length}/200</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  placeholder="Tell your story... Why do you need this funding?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  rows={6}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/2000
                </p>
              </div>

              {/* Goal Amount and Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="goal-amount">Funding Goal (USD) *</Label>
                  <Input
                    id="goal-amount"
                    type="number"
                    placeholder="e.g., 5000"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="education">Education</option>
                    <option value="tuition">Tuition</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="student_loans">Student Loans</option>
                    <option value="living_expenses">Living Expenses</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image-url">Campaign Image URL (optional)</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="mt-4 max-h-64 w-full object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline">Campaign Deadline *</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
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