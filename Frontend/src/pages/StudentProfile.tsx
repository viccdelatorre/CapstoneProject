import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import resolveAvatarUrl from '@/lib/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, BookOpen, Award } from 'lucide-react';

type StudentData = {
  id: number;
  full_name: string;
  email: string;
  avatar?: string | null;                
  university: string | null;
  major: string | null;
  academic_year: string | null;
  gpa: string | number | null;
  campaign?: {
    id: number;
    title: string;
    description: string;
    goal_amount: string;
    current_amount: string;
    category: string;
    progress_percentage: number;
    image_url?: string;
    deadline: string;
  };
};

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<StudentData>(`/students/${id}`);
        const studentData = res.data;
        // resolve avatar if necessary
        if (studentData.avatar && !studentData.avatar.startsWith('http')) {
          const url = await resolveAvatarUrl(studentData.avatar, 60);
          if (url) studentData.avatar = url;
        }
        setStudent(studentData);
      } catch (err) {
        console.error('Failed to load student:', err);
        setError('Could not load student profile');
      } finally {
        setLoading(false);
      }
    }
    loadStudent();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading student...</p>;
  if (error) return <p className="p-6 text-center text-destructive">{error}</p>;
  if (!student) return <p className="p-6 text-center">Student not found</p>;

  const campaign = student.campaign;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button variant="ghost" onClick={() => navigate('/discover')} className="mb-6">
          ← Back to Discovery
        </Button>

        {/* Student Info Card */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              {student.avatar ? (
                <AvatarImage src={student.avatar} alt={student.full_name} />
              ) : (
                <AvatarFallback>{student.full_name?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{student.full_name}</h1>
              <div className="mt-2 space-y-1 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{student.major || 'Field not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{student.university || 'University not specified'}</span>
                </div>
                {student.academic_year && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>{student.academic_year}</span>
                  </div>
                )}
                {student.gpa && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">GPA: {parseFloat(String(student.gpa)).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Campaign Card */}
        {campaign ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{campaign.title}</CardTitle>
              <Badge className="w-fit" variant="secondary">
                {campaign.category}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Image */}
              {campaign.image_url && (
                <img
                  src={campaign.image_url}
                  alt={campaign.title}
                  className="h-48 w-full rounded-lg object-cover"
                />
              )}

              {/* Description */}
              <p className="text-muted-foreground">{campaign.description}</p>

              {/* Funding Progress */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    ${parseFloat(campaign.current_amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} raised
                  </span>
                  <span className="text-muted-foreground">
                    of ${parseFloat(campaign.goal_amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Progress value={campaign.progress_percentage} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {Math.round(campaign.progress_percentage)}% funded
                </div>
              </div>

              {/* Deadline */}
              {campaign.deadline && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Deadline: </span>
                  <span>
                    {new Date(campaign.deadline).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {/* Donate Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate(`/checkout/${student.id}`)}
              >
                Donate Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 p-6">
            <p className="text-center text-muted-foreground">
              This student does not have an active campaign.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}