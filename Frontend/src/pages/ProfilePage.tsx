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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { 
  GraduationCap, 
  School, 
  Upload, 
  Save, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Camera,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  Award,
  BookOpen,
  Users,
  Shield,
  Edit3,
  X,
  Heart,
  Building2,
  Briefcase
} from "lucide-react";

export default function ProfilePage() {
  const { user, hasRole } = useAuth();
  const isDonor = hasRole('donor');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(isDonor ? {
    // Donor Profile Data
    firstName: "Sarah",
    lastName: "Williams", 
    email: "sarah.williams@gmail.com",
    phone: "+1 (555) 987-6543",
    dateOfBirth: "1985-03-20",
    location: "San Francisco, CA",
    bio: "Passionate about education and helping students achieve their dreams. I believe in the power of education to transform lives.",
    
    // Professional Information
    occupation: "Software Engineer",
    company: "Tech Innovations Inc.",
    industry: "Technology",
    experience: "12 years",
    
    // Donor Preferences
    donationInterests: "Computer Science, Engineering, STEM Education",
    givingGoals: "Support underrepresented students in technology fields",
    maxDonationAmount: "5000",
    preferredCommunication: "email",
    
    // Verification Status
    emailVerified: true,
    phoneVerified: true,
    identityVerified: true,
    
    // Profile Settings
    profileVisibility: "public",
    allowMessages: true,
    showEmail: false,
    showPhone: false,
    showDonationHistory: true,
    anonymousDonations: false,
    
    // Social/Professional
    website: "https://sarahwilliams.dev",
    linkedin: "https://linkedin.com/in/sarahwilliams",
    companyWebsite: "https://techinnovations.com",
    
    // Personal Values
    personalValues: "Education equity, diversity in tech, mentorship",
    volunteerExperience: "Mentor at local coding bootcamp, volunteer at education nonprofits"
  } : {
    // Student Profile Data (existing)
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1999-08-15",
    location: "Cambridge, MA",
    bio: "Computer Science student passionate about AI and machine learning. Seeking funding to complete my degree and pursue research in healthcare applications.",
    
    // Academic Information
    university: "Massachusetts Institute of Technology",
    universityEmail: "alex.johnson@mit.edu",
    studentId: "MIT123456789",
    major: "Computer Science",
    minor: "Mathematics",
    academicYear: "Junior",
    expectedGraduation: "2026-05",
    gpa: "3.8",
    
    // Verification Status
    emailVerified: true,
    phoneVerified: false,
    universityVerified: true,
    transcriptUploaded: true,
    enrollmentVerified: true,
    
    // Profile Settings
    profileVisibility: "public",
    allowMessages: true,
    showEmail: false,
    showPhone: false,
    showAcademicRecord: true,
    
    // Social/Professional
    website: "",
    linkedin: "",
    github: "https://github.com/alexjohnson",
    
    // Academic Goals
    careerGoals: "Pursue graduate studies in AI/ML and eventually work in healthcare technology to develop solutions that improve patient outcomes.",
    researchInterests: "Machine Learning, Healthcare AI, Computer Vision",
    academicAchievements: "Dean's List 2023, 2024; Research Assistant in AI Lab; Published paper on medical image analysis"
  });

  // Settings state for account preferences
  const [settings, setSettings] = useState({
    emailNotifications: true,
    profileVisibility: true,
    twoFactorAuth: false,
    donationReminders: isDonor ? true : false,
    applicationReminders: isDonor ? false : true,
  });

  const profileCompletion = () => {
    if (isDonor) {
      const requiredFields = ['firstName', 'lastName', 'email', 'bio', 'occupation', 'donationInterests'];
      const completed = requiredFields.filter(field => profileData[field]).length;
      return Math.round((completed / requiredFields.length) * 100);
    } else {
      const requiredFields = [
        'firstName', 'lastName', 'email', 'university', 'major', 'academicYear', 
        'bio', 'careerGoals', 'gpa'
      ];
      const completed = requiredFields.filter(field => profileData[field]).length;
      return Math.round((completed / requiredFields.length) * 100);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    console.log("Profile saved:", profileData);
  };

  const handleCancel = () => {
    // Reset form data if needed
    setIsEditing(false);
    toast({
      title: "Changes Cancelled",
      description: "Your changes have been discarded.",
      variant: "destructive",
    });
  };

  const handleVerificationAction = (type: string) => {
    // TODO: Implement verification actions
    toast({
      title: "Verification Initiated",
      description: `${type} verification process has been started.`,
    });
  };

  const completion = profileCompletion();

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Management</h1>
          <p className="text-muted-foreground">
            Manage your public profile and verification status
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline"
                onClick={handleCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completion Alert */}
      {completion < 100 && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            Your profile is {completion}% complete. Complete all sections to maximize your funding potential.
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Mode Alert */}
      {isEditing && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Edit3 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            You are now in edit mode. Make your changes and click "Save Changes" to update your profile.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src="" alt={`${profileData.firstName} ${profileData.lastName}`} />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-2">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h3>
                  {isDonor ? (
                    <>
                      <p className="text-muted-foreground">{profileData.company}</p>
                      <p className="text-sm text-muted-foreground">{profileData.occupation} • {profileData.industry}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground">{profileData.university}</p>
                      <p className="text-sm text-muted-foreground">{profileData.major} • {profileData.academicYear}</p>
                    </>
                  )}
                </div>

                {/* Profile Completion */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completion</span>
                    <span className="font-medium">{completion}%</span>
                  </div>
                  <Progress value={completion} className="h-2" />
                </div>

                {/* Verification Status */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-left">{isDonor ? "Account Status" : "Verification Status"}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email</span>
                      <Badge variant={profileData.emailVerified ? "default" : "secondary"}>
                        {profileData.emailVerified ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Verified
                          </>
                        ) : (
                          <>
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    {isDonor ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Identity</span>
                          <Badge variant={profileData.identityVerified ? "default" : "secondary"}>
                            {profileData.identityVerified ? (
                              <>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Verified
                              </>
                            ) : (
                              <>
                                <Clock className="mr-1 h-3 w-3" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">University</span>
                          <Badge variant={profileData.universityVerified ? "default" : "secondary"}>
                            {profileData.universityVerified ? (
                              <>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Verified
                              </>
                            ) : (
                              <>
                                <Clock className="mr-1 h-3 w-3" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Enrollment</span>
                          <Badge variant={profileData.enrollmentVerified ? "default" : "secondary"}>
                            {profileData.enrollmentVerified ? (
                              <>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Verified
                              </>
                            ) : (
                              <>
                                <Clock className="mr-1 h-3 w-3" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Transcripts</span>
                          <Badge variant={profileData.transcriptUploaded ? "default" : "secondary"}>
                            {profileData.transcriptUploaded ? (
                              <>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Uploaded
                              </>
                            ) : (
                              <>
                                <Clock className="mr-1 h-3 w-3" />
                                Required
                              </>
                            )}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    <Globe className="mr-2 h-4 w-4" />
                    View Public Profile
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            {isDonor ? (
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            ) : (
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            )}

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about yourself
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        disabled={!isEditing}
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder={isDonor ? "Tell students about yourself and why you're passionate about supporting education..." : "Tell donors about yourself, your goals, and why you deserve support..."}
                    />
                  </div>

                  {!isDonor && (
                    <div>
                      <Label htmlFor="careerGoals">Career Goals</Label>
                      <Textarea
                        id="careerGoals"
                        value={profileData.careerGoals}
                        onChange={(e) => handleInputChange("careerGoals", e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Describe your long-term career aspirations..."
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Information Tab - Donors Only */}
            {isDonor && (
              <TabsContent value="professional" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Professional Information
                    </CardTitle>
                    <CardDescription>
                      Your professional background and donation preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                          id="occupation"
                          value={profileData.occupation || ""}
                          onChange={(e) => handleInputChange("occupation", e.target.value)}
                          disabled={!isEditing}
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profileData.company || ""}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          disabled={!isEditing}
                          placeholder="Your current employer"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="donationInterests">Donation Interests</Label>
                      <Input
                        id="donationInterests"
                        value={profileData.donationInterests || ""}
                        onChange={(e) => handleInputChange("donationInterests", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., Computer Science, Engineering, STEM Education"
                      />
                    </div>

                    <div>
                      <Label htmlFor="givingGoals">Giving Goals</Label>
                      <Textarea
                        id="givingGoals"
                        value={profileData.givingGoals || ""}
                        onChange={(e) => handleInputChange("givingGoals", e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Describe what you hope to achieve through your donations..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="personalValues">Personal Values</Label>
                      <Textarea
                        id="personalValues"
                        value={profileData.personalValues || ""}
                        onChange={(e) => handleInputChange("personalValues", e.target.value)}
                        disabled={!isEditing}
                        rows={2}
                        placeholder="What drives your passion for supporting education?"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Academic Information Tab - Students Only */}
            {!isDonor && (
              <TabsContent value="academic" className="space-y-6">
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
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="university">University/Institution</Label>
                    <Input
                      id="university"
                      value={profileData.university}
                      onChange={(e) => handleInputChange("university", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="universityEmail">University Email</Label>
                      <Input
                        id="universityEmail"
                        type="email"
                        value={profileData.universityEmail}
                        onChange={(e) => handleInputChange("universityEmail", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={profileData.studentId}
                        onChange={(e) => handleInputChange("studentId", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="major">Major</Label>
                      <Input
                        id="major"
                        value={profileData.major}
                        onChange={(e) => handleInputChange("major", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minor">Minor (Optional)</Label>
                      <Input
                        id="minor"
                        value={profileData.minor}
                        onChange={(e) => handleInputChange("minor", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Select 
                        value={profileData.academicYear} 
                        onValueChange={(value) => handleInputChange("academicYear", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Freshman">Freshman</SelectItem>
                          <SelectItem value="Sophomore">Sophomore</SelectItem>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                      <Input
                        id="expectedGraduation"
                        type="month"
                        value={profileData.expectedGraduation}
                        onChange={(e) => handleInputChange("expectedGraduation", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gpa">Current GPA</Label>
                      <Input
                        id="gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={profileData.gpa}
                        onChange={(e) => handleInputChange("gpa", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="researchInterests">Research Interests</Label>
                    <Input
                      id="researchInterests"
                      value={profileData.researchInterests}
                      onChange={(e) => handleInputChange("researchInterests", e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Machine Learning, Healthcare AI, Computer Vision"
                    />
                  </div>

                  <div>
                    <Label htmlFor="academicAchievements">Academic Achievements</Label>
                    <Textarea
                      id="academicAchievements"
                      value={profileData.academicAchievements}
                      onChange={(e) => handleInputChange("academicAchievements", e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="List your academic honors, awards, publications, etc."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            )}

            {/* Verification Tab - Students Only */}
            {!isDonor && (
              <TabsContent value="verification" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Verification
                  </CardTitle>
                  <CardDescription>
                    Verify your identity and academic status to build trust with donors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Verification */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Email Verification</h4>
                        <p className="text-sm text-muted-foreground">Verify your email address</p>
                      </div>
                    </div>
                    {profileData.emailVerified ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVerificationAction("Email")}
                      >
                        Send Verification
                      </Button>
                    )}
                  </div>

                  {/* University Verification */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <School className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">University Email</h4>
                        <p className="text-sm text-muted-foreground">Verify your .edu email address</p>
                      </div>
                    </div>
                    {profileData.universityVerified ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVerificationAction("University")}
                      >
                        Send Verification
                      </Button>
                    )}
                  </div>

                  {/* Enrollment Verification */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Enrollment Status</h4>
                        <p className="text-sm text-muted-foreground">Confirm current enrollment</p>
                      </div>
                    </div>
                    {profileData.enrollmentVerified ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVerificationAction("Enrollment")}
                      >
                        Upload Documents
                      </Button>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Academic Documents</h4>
                        <p className="text-sm text-muted-foreground">Upload transcripts and enrollment verification</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Official Transcript</span>
                        <Badge variant={profileData.transcriptUploaded ? "default" : "secondary"}>
                          {profileData.transcriptUploaded ? "Uploaded" : "Required"}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            )}

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        {isDonor 
                          ? "Receive updates about donation campaigns and impact reports" 
                          : "Receive updates about your applications and scholarships"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={settings.emailNotifications} 
                        onCheckedChange={isEditing ? (value) => setSettings(prev => ({ ...prev, emailNotifications: value })) : undefined}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Profile Visibility</h4>
                      <p className="text-sm text-muted-foreground">
                        {isDonor 
                          ? "Allow your donation history to be visible to the community" 
                          : "Allow your profile to be visible to potential donors"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={settings.profileVisibility} 
                        onCheckedChange={isEditing ? (value) => setSettings(prev => ({ ...prev, profileVisibility: value })) : undefined}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={settings.twoFactorAuth} 
                        onCheckedChange={isEditing ? (value) => setSettings(prev => ({ ...prev, twoFactorAuth: value })) : undefined}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isDonor && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Donation Reminders</h4>
                        <p className="text-sm text-muted-foreground">Get reminded about monthly donation goals and opportunities</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={settings.donationReminders} 
                          onCheckedChange={isEditing ? (value) => setSettings(prev => ({ ...prev, donationReminders: value })) : undefined}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  )}

                  {!isDonor && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Application Reminders</h4>
                        <p className="text-sm text-muted-foreground">Get reminded about upcoming application deadlines</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={settings.applicationReminders} 
                          onCheckedChange={isEditing ? (value) => setSettings(prev => ({ ...prev, applicationReminders: value })) : undefined}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}