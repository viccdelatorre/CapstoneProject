import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Upload, 
  DollarSign, 
  Calendar, 
  Target, 
  FileText, 
  Image, 
  Eye, 
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Users,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundingGoal: "",
    duration: "30",
    category: "",
    story: "",
    expenses: "",
    timeline: "",
    agreeToTerms: false,
    allowPublicSharing: true
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: FileText },
    { id: 2, title: "Your Story", icon: Heart },
    { id: 3, title: "Financial Details", icon: DollarSign },
    { id: 4, title: "Review & Submit", icon: CheckCircle2 }
  ];

  const categories = [
    "Tuition & Fees",
    "Books & Supplies",
    "Living Expenses",
    "Technology & Equipment",
    "Study Abroad",
    "Graduate School",
    "Professional Development",
    "Emergency Financial Aid"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // TODO: Submit to backend
    console.log("Campaign submitted:", formData);
    navigate("/student");
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.fundingGoal && formData.category;
      case 2:
        return formData.story && formData.timeline;
      case 3:
        return formData.expenses;
      case 4:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Create Your Campaign
        </h1>
        <p className="text-muted-foreground">
          Tell your story and connect with donors who want to support your education
        </p>
      </div>

      {/* Progress Indicator */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Campaign Creation Progress</span>
            <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
          </div>
          <Progress value={progressPercentage} className="mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id || isStepComplete(step.id);
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs text-center ${
                    isActive ? 'font-semibold' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Steps */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Campaign Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Help Me Complete My Computer Science Degree"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Make it compelling and specific to your educational goal
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief overview of your campaign (2-3 sentences)"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fundingGoal">Funding Goal ($) *</Label>
                    <Input
                      id="fundingGoal"
                      type="number"
                      placeholder="5000"
                      value={formData.fundingGoal}
                      onChange={(e) => handleInputChange("fundingGoal", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Campaign Duration</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="120">120 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Your Story
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="story">Tell Your Story *</Label>
                  <Textarea
                    id="story"
                    placeholder="Share your educational journey, challenges you've overcome, and why this funding matters to you..."
                    value={formData.story}
                    onChange={(e) => handleInputChange("story", e.target.value)}
                    rows={8}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Be authentic and specific. Donors connect with genuine stories (recommended: 300-500 words)
                  </p>
                </div>

                <div>
                  <Label htmlFor="timeline">Academic Timeline *</Label>
                  <Textarea
                    id="timeline"
                    placeholder="Describe your academic progress, current year, expected graduation, and how this funding fits into your timeline..."
                    value={formData.timeline}
                    onChange={(e) => handleInputChange("timeline", e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Include specific details about your academic achievements, 
                    future goals, and how donors' support will make a direct impact on your education.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Breakdown
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="expenses">Detailed Expense Breakdown *</Label>
                  <Textarea
                    id="expenses"
                    placeholder="Break down how you'll use the funds:
• Tuition: $3,000
• Books & Supplies: $800
• Technology/Software: $700
• Living Expenses: $500"
                    value={formData.expenses}
                    onChange={(e) => handleInputChange("expenses", e.target.value)}
                    rows={8}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Be transparent about how funds will be used. Detailed breakdowns build trust with donors.
                  </p>
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Transparency builds trust:</strong> Donors are more likely to contribute when they 
                    understand exactly how their money will be used to support your education.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Review & Submit
                </h3>
              </div>

              {/* Campaign Preview */}
              <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
                <h4 className="font-semibold mb-4">Campaign Preview</h4>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Title:</span> {formData.title || "Not set"}
                  </div>
                  <div>
                    <span className="font-medium">Goal:</span> ${formData.fundingGoal || "0"}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {formData.category || "Not set"}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {formData.duration} days
                  </div>
                  <div>
                    <span className="font-medium">Story:</span> {formData.story ? `${formData.story.substring(0, 100)}...` : "Not set"}
                  </div>
                </div>
              </div>

              {/* Terms and Settings */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                    I agree to the <span className="text-blue-600 underline cursor-pointer">Terms of Service</span> and 
                    <span className="text-blue-600 underline cursor-pointer"> Privacy Policy</span>. I understand that 
                    all information provided will be verified and that misrepresentation may result in campaign removal.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="allowPublicSharing"
                    checked={formData.allowPublicSharing}
                    onCheckedChange={(checked) => handleInputChange("allowPublicSharing", checked as boolean)}
                  />
                  <Label htmlFor="allowPublicSharing" className="text-sm">
                    Allow public sharing of my campaign on social media and partner platforms
                  </Label>
                </div>
              </div>

              {!formData.agreeToTerms && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You must agree to the terms and conditions to submit your campaign.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!isStepComplete(currentStep)}
                >
                  Next Step
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => console.log("Save draft")}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.agreeToTerms}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit Campaign
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Need Help?
          </CardTitle>
          <CardDescription>
            Tips for creating a successful campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Make it Personal</h4>
              <p className="text-sm text-muted-foreground">
                Share your unique story, challenges, and dreams. Authenticity resonates with donors.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Be Specific</h4>
              <p className="text-sm text-muted-foreground">
                Provide detailed expense breakdowns and clear funding goals.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Stay Engaged</h4>
              <p className="text-sm text-muted-foreground">
                Regular updates and donor communication increase funding success by 40%.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Set Realistic Goals</h4>
              <p className="text-sm text-muted-foreground">
                Campaigns with achievable targets are 3x more likely to succeed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}