import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        const res = await api.get(`/students/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error('Failed to load student:', err);
      }
    }
    loadStudent();
  }, [id]);

  if (!student) return <p className="p-6 text-center">Loading student...</p>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button variant="ghost" onClick={() => navigate('/discover')} className="mb-6">
          ← Back to Discovery
        </Button>

        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.full_name)}`}
                alt={student.full_name}
              />
              <AvatarFallback>{student.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold">{student.full_name}</h1>
              <p className="text-muted-foreground">{student.university}</p>
              <p className="text-muted-foreground">{student.major}</p>
              <div className="mt-4">
                <Progress value={60} className="h-3" />
              </div>
              <Button className="mt-6" onClick={() => navigate(`/checkout/${student.id}`)}>
                Donate Now
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
