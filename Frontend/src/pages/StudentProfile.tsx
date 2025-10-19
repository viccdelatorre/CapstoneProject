import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, BookOpen, Calendar, CheckCircle2, Heart, Share2, Flag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Mock student data
const mockStudent = {
  id: '1',
  name: 'Sarah Chen',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  school: 'Massachusetts Institute of Technology',
  fieldOfStudy: 'Computer Science - AI/ML',
  location: 'Cambridge, MA',
  verified: true,
  tags: ['AI', 'Healthcare', 'First-Gen', 'Research'],
  goalAmount: 15000,
  raisedAmount: 8500,
  donorCount: 42,
  story: `I'm Sarah, a first-generation college student pursuing my passion for artificial intelligence at MIT. My journey hasn't been easy, but it's been driven by a clear purpose: using technology to make healthcare accessible to underserved communities.

Growing up in a rural community with limited access to healthcare, I witnessed firsthand how technology gaps can be life-or-death issues. This inspired me to focus my research on developing AI-powered diagnostic tools that can work offline and require minimal training to operate.

Your support will help me continue my research and complete my degree. Every dollar goes directly toward tuition, research materials, and living expenses, allowing me to focus on creating solutions that will impact thousands of lives.`,
  
  budget: [
    { category: 'Tuition', amount: 8000, percentage: 53 },
    { category: 'Research Materials', amount: 3000, percentage: 20 },
    { category: 'Living Expenses', amount: 2500, percentage: 17 },
    { category: 'Books & Supplies', amount: 1500, percentage: 10 },
  ],
  
  milestones: [
    { title: 'Complete Fall Semester', date: 'Dec 2025', completed: true },
    { title: 'Publish Research Paper', date: 'Jan 2026', completed: false },
    { title: 'Spring Semester Tuition', date: 'Jan 2026', completed: false },
    { title: 'Graduate with Honors', date: 'May 2026', completed: false },
  ],
  
  updates: [
    {
      id: '1',
      date: '2 weeks ago',
      title: 'Research Breakthrough!',
      content: 'Excited to share that our AI model achieved 94% accuracy in early disease detection...',
    },
    {
      id: '2',
      date: '1 month ago',
      title: 'Mid-Semester Update',
      content: 'Thank you all for your incredible support! I wanted to share my progress this semester...',
    },
  ],
};

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const progressPercentage = Math.round((mockStudent.raisedAmount / mockStudent.goalAmount) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/discover')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Discovery
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage src={mockStudent.avatar} alt={mockStudent.name} />
                    <AvatarFallback>{mockStudent.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold">{mockStudent.name}</h1>
                        {mockStudent.verified && (
                          <Badge variant="outline" className="mt-2 border-success text-success">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Verified Student
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{mockStudent.fieldOfStudy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{mockStudent.school}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{mockStudent.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {mockStudent.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="story" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
              </TabsList>

              <TabsContent value="story">
                <Card>
                  <CardHeader>
                    <CardTitle>My Story</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    {mockStudent.story.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="budget">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockStudent.budget.map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-muted-foreground">
                            ${item.amount.toLocaleString()} ({item.percentage}%)
                          </span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones">
                <Card>
                  <CardHeader>
                    <CardTitle>Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockStudent.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${milestone.completed ? 'bg-success text-success-foreground' : 'bg-muted'}`}>
                            {milestone.completed && <CheckCircle2 className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className={`font-medium ${milestone.completed ? 'line-through' : ''}`}>
                                {milestone.title}
                              </span>
                              <span className="text-sm text-muted-foreground">{milestone.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates">
                <div className="space-y-4">
                  {mockStudent.updates.map((update) => (
                    <Card key={update.id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{update.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-6 space-y-4">
                  <div>
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${mockStudent.raisedAmount.toLocaleString()}</span>
                      <span className="text-muted-foreground">raised</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                      <span>{progressPercentage}% of ${mockStudent.goalAmount.toLocaleString()}</span>
                      <span>{mockStudent.donorCount} donors</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => navigate(`/checkout/${id}`)}
                      className="col-span-3"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Donate Now
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">Save</Button>
                    <Button variant="outline">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Quick donate:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm">$25</Button>
                      <Button variant="outline" size="sm">$50</Button>
                      <Button variant="outline" size="sm">$100</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/30 p-4 text-sm">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>100% Transparent</span>
                  </div>
                  <p className="text-muted-foreground">
                    All donations go directly to the student. Track receipts and milestones.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
