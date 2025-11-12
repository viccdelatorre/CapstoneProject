import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/axios";

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
  TrendingUp
} from "lucide-react";

type StudentProfile = {
  id: number;
  full_name: string;
  email: string;
  university?: string | null;
  major?: string | null;
  academic_year?: string | null;
  gpa?: string | number | null;
};

export default function StudentDashboard() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

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

  const displayName =
    profile?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Student";

  // Use profile values with reasonable fallbacks
  const studentData = {
    name: displayName,
    university: profile?.university || "Add your university",
    major: profile?.major || "Add your major",
    year: profile?.academic_year || "Add your academic year",
    gpa: profile?.gpa ?? "N/A",
    profileComplete: 85, // you can later compute this from profile
    fundingGoal: 15000,
    currentFunding: 8500,
    donors: 12,
    campaigns: 2,
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
              +2 this month
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

        {/* ... overview & funding tabs unchanged ... */}

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
    </div>
  );
}
