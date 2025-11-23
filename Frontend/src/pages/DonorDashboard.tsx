import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, DollarSign, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const DonorDashboard = () => {
  // Mock data
  const stats = {
    totalDonated: 5000,
    studentsSupported: 8,
    activeScholarships: 3,
    impactScore: 92,
  };

  const recentDonations = [
    {
      id: 1,
      studentName: "Sarah Johnson",
      amount: 500,
      date: "2025-10-15",
      status: "active",
      progress: 75,
    },
    {
      id: 2,
      studentName: "Michael Chen",
      amount: 1000,
      date: "2025-10-10",
      status: "active",
      progress: 45,
    },
    {
      id: 3,
      studentName: "Emily Rodriguez",
      amount: 750,
      date: "2025-10-05",
      status: "completed",
      progress: 100,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Donor Dashboard</h1>
        <p className="text-muted-foreground">Track your impact and manage your giving</p>
      </div>
          {/* Donor Tier Overview */}
          <Card className="mb-8 border-l-4 border-yellow-500">
            <CardHeader>
              <CardTitle>Your Donor Tier</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Gold Member</h2>
                <p className="text-sm text-muted-foreground">
                  You’ve donated $5,000 total —  🌟 top 5% of donors
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm text-muted-foreground mb-1">Progress to next reward</p>
                <Progress value={82} className="w-40" />
              </div>
            </CardContent>
          </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalDonated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students Supported</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studentsSupported}</div>
            <p className="text-xs text-muted-foreground mt-1">Across 5 universities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeScholarships}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently funding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.impactScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Donations</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/donor/wallet">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{donation.studentName}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        donation.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{donation.progress}%</span>
                    </div>
                    <Progress value={donation.progress} />
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-2xl font-bold">${donation.amount}</p>
                  <p className="text-xs text-muted-foreground">{donation.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-primary text-white">
          <CardHeader>
            <CardTitle>Discover New Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 opacity-90">
              Find students who align with your giving priorities and make a direct impact.
            </p>
            <Button asChild variant="secondary">
              <Link to="/discover">Browse Students</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Review and support students you've saved to your shortlist.
            </p>
            <Button asChild variant="outline">
              <Link to="/donor/saved">View Saved</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonorDashboard;
