import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

export default function StudentDashboard() {
  // Mock data - replace with real data from your backend
  const studentData = {
    name: "Alex Johnson",
    university: "State University",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.8,
    profileComplete: 85,
    fundingGoal: 15000,
    currentFunding: 8500,
    donors: 12,
    campaigns: 2
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
            <div className="text-2xl font-bold">{studentData.gpa}</div>
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

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest funding and engagement updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>
                  Important deadlines and action items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.deadline}</p>
                    </div>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : 
                              task.priority === 'medium' ? 'default' : 'secondary'}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
                <CardDescription>
                  Track your education funding journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Funding</span>
                    <span className="font-medium">${studentData.currentFunding.toLocaleString()}</span>
                  </div>
                  <Progress value={fundingProgress} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span>{Math.round(fundingProgress)}% Complete</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Create New Campaign
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share Your Story
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donor Engagement</CardTitle>
                <CardDescription>
                  Connect with your supporters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Stay Connected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Regular updates keep donors engaged and increase funding success.
                  </p>
                  <Button>Send Update to Donors</Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
                    <p className="text-lg">{studentData.university}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Major</label>
                    <p className="text-lg">{studentData.major}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Academic Year</label>
                    <p className="text-lg">{studentData.year}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Current GPA</label>
                    <p className="text-lg font-semibold text-green-600">{studentData.gpa}/4.0</p>
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