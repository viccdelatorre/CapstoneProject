import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Heart, 
  Target, 
  Handshake, 
  BrainCircuit, 
  Share2, 
  TrendingUp, 
  Network,
  GraduationCap,
  Building2,
  Award,
  CheckCircle2
} from "lucide-react";

const Help = () => {
  const steps = [
    {
      id: 1,
      icon: Target,
      title: "Create a Fundraising Campaign",
      description: "Educational institutions, student organizations, or individual advocates can launch campaigns to fund scholarships for deserving students. Each campaign includes clear goals, eligibility criteria, and a compelling story to inspire potential donors."
    },
    {
      id: 2,
      icon: Heart,
      title: "Support & Contribute",
      description: "Donors can browse campaigns and contribute to the ones that resonate with their values. Whether you're an alumni, corporate sponsor, or individual donor, every contribution directly impacts students' educational journeys."
    },
    {
      id: 3,
      icon: Users,
      title: "Foster a Community",
      description: "EduFund connects students and donors in meaningful ways, fostering a sense of community and shared purpose.",
      features: [
        "Mentorship Opportunities: Donors can mentor students, providing guidance and insights.",
        "Leadership Development: Students engage in leadership activities through EduFund-sponsored programs."
      ]
    },
    {
      id: 4,
      icon: BrainCircuit,
      title: "Provide Real-World Experiences",
      description: "Beyond financial aid, EduFund connects students with opportunities to grow professionally:",
      features: [
        "Work-Study & Placement Opportunities: Gain practical experience and build your resume.",
        "Real-Life Projects: Work on real-world challenges, blending academic learning with hands-on application."
      ]
    },
    {
      id: 5,
      icon: Share2,
      title: "Share & Promote Campaigns",
      description: "EduFund empowers campaign creators with tools to spread the word. Share campaigns on social media, via email, or through community outreach."
    },
    {
      id: 6,
      icon: TrendingUp,
      title: "Track Progress & Celebrate Success",
      description: "Monitor funding progress in real-time. Once scholarships are awarded, EduFund provides updates, testimonials, and success stories."
    },
    {
      id: 7,
      icon: Network,
      title: "Build a Lifelong Network",
      description: "EduFund isn't just about one-time support—it's about creating lasting relationships.",
      features: [
        "Students build networks with donors, mentors, and peers.",
        "Donors witness the tangible outcomes of their contributions.",
        "Institutions strengthen their communities and create impactful programs."
      ]
    }
  ];

  return (
    <div className="container py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          <GraduationCap className="mr-1 h-3 w-3" />
          How It Works
        </Badge>
        <h1 className="text-4xl font-bold mb-6">
          Crowdfunding for Education, Building Communities
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          At EduFund, we go beyond just raising funds for scholarships. Our platform creates a community where 
          donors, students, and institutions collaborate to empower education through mentorship, leadership, 
          and real-world opportunities.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isEven = index % 2 === 0;
          
          return (
            <div key={step.id} className={`flex flex-col lg:flex-row items-center gap-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              {/* Icon & Number */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>
              </div>

              {/* Content */}
              <Card className="flex-1 border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  {step.features && (
                    <div className="space-y-3">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{feature}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center">
        <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <Award className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Education?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of donors, students, and institutions who are building stronger communities 
              through education. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Create Campaign
              </a>
              <a 
                href="/discover" 
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Browse Campaigns
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
