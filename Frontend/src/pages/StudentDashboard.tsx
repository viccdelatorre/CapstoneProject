import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/axios";
import { toast } from "sonner";

import { 
  GraduationCap, 
  DollarSign, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Heart,
  MessageSquare,
  Settings,
  Upload,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Edit,
  Trash2
} from "lucide-react";
import { boolean } from "zod";

type StudentProfile = {
  id: number;
  full_name: string;
  email: string;
  university?: string | null;
  major?: string | null;
  academic_year?: string | null;
  gpa?: string | number | null;
};

type Campaign = {
  id: number;
  title: string;
  description: string;
  goal_amount: string;
  current_amount: string;
  progress_percentage: number;
  category: string;
  image_url?: string | null;
  deadline: string;
  created_at: string;
  student: {
    id: number;
    full_name: string;
  };
};

export default function StudentDashboard() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  // Edit modal state
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editGoalAmount, setEditGoalAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setLoadingProfile(false);
          return;
        }

        // adjust to your actual URL: /auth/profile/ or /auth/get_my_profile/
        const res = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
      } catch (err) {
        console.error("Error loading profile", err);
        setProfileError("Could not load your profile information.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setLoadingCampaigns(false);
          return;
        }

        // Get student profile to get student ID
        const profileRes = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const studentId = profileRes.data.id;

        // Fetch campaigns for this student
        const campaignsRes = await api.get<Campaign[]>(`/campaigns?student_id=${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCampaigns(campaignsRes.data);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Open edit dialog
  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditTitle(campaign.title);
    setEditDescription(campaign.description);
    setEditGoalAmount(campaign.goal_amount);
    setEditCategory(campaign.category);
    setEditImageUrl(campaign.image_url || "");
    // Convert ISO date to datetime-local format
    const deadlineDate = new Date(campaign.deadline);
    const localDateTime = new Date(deadlineDate.getTime() - deadlineDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setEditDeadline(localDateTime);
    setIsEditDialogOpen(true);
  };

  // Update campaign
  const handleUpdateCampaign = async () => {
    if (!editingCampaign) return;

    try {
      setEditLoading(true);
      const token = localStorage.getItem("access");

      // Convert deadline to ISO format
      const deadlineDate = new Date(editDeadline);
      const isoDeadline = deadlineDate.toISOString();

      await api.put(
        `/campaigns/${editingCampaign.id}/update`,
        {
          title: editTitle.trim(),
          description: editDescription.trim(),
          goal_amount: parseFloat(editGoalAmount),
          category: editCategory,
          image_url: editImageUrl || null,
          deadline: isoDeadline,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Campaign updated successfully!");
      setIsEditDialogOpen(false);
      
      // Refresh campaigns list
      const profileRes = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentId = profileRes.data.id;
      const campaignsRes = await api.get<Campaign[]>(`/campaigns?student_id=${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(campaignsRes.data);
    } catch (err: any) {
      console.error("Error updating campaign", err);
      toast.error(err.response?.data?.error || "Failed to update campaign");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete campaign
  const handleDeleteCampaign = async (campaignId: number, campaignTitle: string) => {
    if (!confirm(`Are you sure you want to delete the campaign "${campaignTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("access");

      await api.delete(`/campaigns/${campaignId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Campaign deleted successfully!");
      
      // Refresh campaigns list
      const profileRes = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentId = profileRes.data.id;
      const campaignsRes = await api.get<Campaign[]>(`/campaigns?student_id=${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(campaignsRes.data);
    } catch (err: any) {
      console.error("Error deleting campaign", err);
      toast.error(err.response?.data?.error || "Failed to delete campaign");
    }
  };

  const displayName =
    profile?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Student";

  // Calculate totals from campaigns
  const totalGoal = campaigns.reduce((sum, c) => sum + parseFloat(c.goal_amount || "0"), 0);
  const totalFunding = campaigns.reduce((sum, c) => sum + parseFloat(c.current_amount || "0"), 0);
  const totalDonors = 0; // You can later fetch and calculate this value
  const newDonorsThisMonth = 0;
  const newDonor: boolean = true;

  // Use profile values with reasonable fallbacks
  const studentData = {
    name: displayName,
    university: profile?.university || "Add your university",
    major: profile?.major || "Add your major",
    year: profile?.academic_year || "Add your academic year",
    gpa: profile?.gpa ?? "N/A",
    profileComplete: 85, // you can later compute this from profile
    fundingGoal: totalGoal,
    currentFunding: totalFunding,
    donors: totalDonors,
    campaigns: campaigns.length,
    myDonorsInMonth: totalDonors - newDonorsThisMonth,
  };

  const recentActivities = [
    { type: "donation", message: "Sarah M. donated $500", time: "2 hours ago", icon: Heart },
    { type: "message", message: "New message from donor", time: "1 day ago", icon: MessageSquare },
    { type: "milestone", message: "Reached 50% funding goal!", time: "3 days ago", icon: Award },
    { type: "update", message: "Profile viewed 15 times", time: "1 week ago", icon: TrendingUp }
  ];

  const upcomingTasks = [
    { task: "Submit semester grades", deadline: "Dec 15", priority: "high" },
    { task: "Update project portfolio", deadline: "Dec 20", priority: "medium" },
    { task: "Send thank you notes", deadline: "Dec 22", priority: "low" }
  ];

  const fundingProgress = (studentData.currentFunding / studentData.fundingGoal) * 100;

  return (
    <div className="container py-8 max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {studentData.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's your education funding overview and recent activity
        </p>

        {loadingProfile && (
          <p className="text-sm text-muted-foreground mt-2">
            Loading your profile...
          </p>
        )}
        {profileError && (
          <p className="text-sm text-destructive mt-2">
            {profileError}
          </p>
        )}
      </div>

      {/* Profile Completion Alert */}
      {studentData.profileComplete < 100 && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CheckCircle2 className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            Your profile is {studentData.profileComplete}% complete. 
            <Button variant="link" className="ml-1 p-0 h-auto text-amber-800 dark:text-amber-200">
              Complete your profile
            </Button> to increase your funding potential.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${studentData.currentFunding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              of ${studentData.fundingGoal.toLocaleString()} goal
            </p>
            <Progress value={fundingProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.donors}</div>
            <p className="text-xs text-muted-foreground">
              +{studentData.myDonorsInMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentData.gpa === "N/A" ? "N/A" : studentData.gpa}
            </div>
            <p className="text-xs text-muted-foreground">
              Current semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.campaigns}</div>
            <p className="text-xs text-muted-foreground">
              1 pending review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex w-full justify-center space-x-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Active Campaigns Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    My Active Campaigns
                  </CardTitle>
                  <CardDescription>
                    Track your fundraising campaigns
                  </CardDescription>
                </div>
                <Button onClick={() => window.location.href = '/campaigns/new'}>
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingCampaigns ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading campaigns...
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first fundraising campaign to reach your educational goals.
                  </p>
                  <Button onClick={() => window.location.href = '/CreateCampaign'}>
                    Create Your First Campaign
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {campaign.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={campaign.image_url} 
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{campaign.title}</CardTitle>
                            <Badge variant="secondary" className="mb-2">
                              {campaign.category}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {campaign.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold">
                              ${parseFloat(campaign.current_amount).toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              of ${parseFloat(campaign.goal_amount).toLocaleString()}
                            </span>
                          </div>
                          <Progress value={campaign.progress_percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {campaign.progress_percentage.toFixed(1)}% funded
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(campaign.deadline).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{new Date(campaign.deadline) > new Date() ? 'Active' : 'Ended'}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEditCampaign(campaign)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Share
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteCampaign(campaign.id, campaign.title)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-start justify-between pb-4 border-b last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.task}</p>
                        <p className="text-xs text-muted-foreground">Due: {task.deadline}</p>
                      </div>
                      <Badge 
                        variant={
                          task.priority === 'high' ? 'destructive' : 
                          task.priority === 'medium' ? 'default' : 
                          'secondary'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Funding Tab */}
        <TabsContent value="funding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funding Overview</CardTitle>
              <CardDescription>
                Detailed breakdown of your funding sources and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Funding details will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
              <CardDescription>
                Your educational background and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">University</label>
                    <p className="text-lg">
                      {studentData.university}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Major</label>
                    <p className="text-lg">
                      {studentData.major}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Academic Year</label>
                    <p className="text-lg">
                      {studentData.year}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Current GPA</label>
                    <p className="text-lg font-semibold text-green-600">
                      {studentData.gpa === "N/A" ? "N/A" : `${studentData.gpa}/4.0`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Transcripts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Management
              </CardTitle>
              <CardDescription>
                Manage your public profile and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="font-semibold mb-2">{studentData.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Profile {studentData.profileComplete}% Complete
                </p>
                <div className="space-y-2">
                  <Button>Edit Profile</Button>
                  <Button variant="outline" className="w-full">
                    View Public Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Campaign</DialogTitle>
            <DialogDescription>
              Make changes to your campaign details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Campaign Title *</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Campaign title"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">{editTitle.length}/200</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Campaign description"
                rows={6}
                maxLength={2000}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">{editDescription.length}/2000</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-goal">Goal Amount (USD) *</Label>
                <Input
                  id="edit-goal"
                  type="number"
                  value={editGoalAmount}
                  onChange={(e) => setEditGoalAmount(e.target.value)}
                  placeholder="5000"
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL (optional)</Label>
              <Input
                id="edit-image"
                type="url"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {editImageUrl && (
                <img
                  src={editImageUrl}
                  alt="Preview"
                  className="mt-2 max-h-48 w-full object-cover rounded-lg"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-deadline">Deadline *</Label>
              <Input
                id="edit-deadline"
                type="datetime-local"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCampaign}
              disabled={editLoading}
            >
              {editLoading ? "Updating..." : "Update Campaign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
