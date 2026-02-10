import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, DollarSign, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

const DonorDashboard = () => {
  // Stats default to zeros so UI shows sensible defaults for new donors
  const [stats, setStats] = useState({
    totalDonated: 0,
    studentsSupported: 0,
    activeScholarships: 0,
    impactScore: 0,
    // optional field for progress to next reward (percentage 0-100)
    progressToNext: 0,
  });

  // Recent donations start empty for new donors
  const [recentDonations, setRecentDonations] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchDonorData() {
      try {
        // Fetch donor profile (backend endpoint: /donor/profile)
        const res = await api.get("donor/profile");
        const data = res.data || {};

        // Parse total_donations (backend returns string)
        const totalDonated = data.total_donations ? Number(data.total_donations) : 0;

        // Keep other stats at 0 if not provided by backend
        const updated = {
          totalDonated,
          studentsSupported: data.students_supported ?? 0,
          activeScholarships: data.active_scholarships ?? 0,
          impactScore: data.impact_score ?? 0,
          progressToNext: data.progress_to_next ?? 0,
        };

        if (mounted) setStats(updated);

        // If there's an endpoint for recent donations in the future, fetch here.
        // For now initialize as empty for new donors (per requirements).
        if (mounted) setRecentDonations([]);
      } catch (err) {
        // Silently fail and keep defaults (useful for local dev without backend)
        // Optionally you could set an error state here.
        if (mounted) {
          setStats((s) => ({ ...s }));
          setRecentDonations([]);
        }
      }
    }

    fetchDonorData();

    return () => {
      mounted = false;
    };
  }, []);

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
                  You’ve donated ${stats.totalDonated.toLocaleString()} total —  🌟 top 5% of donors
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm text-muted-foreground mb-1">Progress to next reward</p>
                <Progress value={Math.max(0, Math.min(100, stats.progressToNext || 0))} className="w-40" />
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
                      <span className="font-medium">{donation.progress ?? 0}%</span>
                    </div>
                    <Progress value={Math.max(0, Math.min(100, donation.progress ?? 0))} />
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-2xl font-bold">${(donation.amount ?? 0).toLocaleString()}</p>
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
