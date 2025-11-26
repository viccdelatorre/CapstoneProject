import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Heart, CheckCircle2, MapPin, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/axios';
import { supabase } from '@/lib/supabase';

type Urgency = 'high' | 'medium' | 'low';

type StudentCard = {
  id: string;
  name: string;
  avatar: string;
  school: string;
  fieldOfStudy: string;
  location: string;
  story: string;
  goalAmount: number;
  raisedAmount: number;
  verified: boolean;
  tags: string[];
  urgency: Urgency;
};

type ApiStudent = {
  id: number;
  full_name: string;
  email: string;
  university: string | null;
  major: string | null;
  academic_year: string | null;
  gpa: number | null;
};

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Mock data – used as fallback / in mock auth mode
const mockStudents: StudentCard[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    school: 'MIT',
    fieldOfStudy: 'Computer Science',
    location: 'Cambridge, MA',
    story:
      'First-generation college student pursuing AI research to help underserved communities access healthcare...',
    goalAmount: 15000,
    raisedAmount: 8500,
    verified: true,
    tags: ['AI', 'Healthcare', 'First-Gen'],
    urgency: 'high',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    school: 'Stanford University',
    fieldOfStudy: 'Environmental Engineering',
    location: 'Palo Alto, CA',
    story: 'Working on sustainable water purification systems for developing nations...',
    goalAmount: 12000,
    raisedAmount: 9200,
    verified: true,
    tags: ['Environment', 'Engineering', 'Sustainability'],
    urgency: 'medium',
  },
  {
    id: '3',
    name: 'Aisha Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    school: 'UC Berkeley',
    fieldOfStudy: 'Biomedical Engineering',
    location: 'Berkeley, CA',
    story:
      'Developing affordable prosthetics for children in low-income communities...',
    goalAmount: 18000,
    raisedAmount: 4500,
    verified: true,
    tags: ['Medicine', 'Innovation', 'Social Impact'],
    urgency: 'high',
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    school: 'Columbia University',
    fieldOfStudy: 'Education Policy',
    location: 'New York, NY',
    story: 'Researching education equity and access for rural communities...',
    goalAmount: 10000,
    raisedAmount: 7800,
    verified: true,
    tags: ['Education', 'Policy', 'Rural'],
    urgency: 'low',
  },
];

const mapApiStudentToCard = (s: ApiStudent): StudentCard => {
  const tags: string[] = [];

  if (s.major) tags.push(s.major);
  if (s.academic_year) tags.push(s.academic_year);
  if (s.gpa != null && !isNaN(Number(s.gpa))) tags.push(`${Number(s.gpa).toFixed(2)} GPA`);

  return {
    id: String(s.id),
    name: s.full_name || s.email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      s.full_name || s.email || 'Student'
    )}`,
    school: s.university || 'University not specified',
    fieldOfStudy: s.major || 'Field of study not specified',
    location: s.university || '',
    story:
      s.major || s.university
        ? `Student at ${s.university || 'their university'} studying ${
            s.major || 'their field'
          }...`
        : 'Student profile coming soon...',
    goalAmount: 10000,
    raisedAmount: 0,
    verified: true,
    tags,
    urgency: 'medium',
  };
};

export default function Discover() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [students, setStudents] = useState<StudentCard[]>(mockStudents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      if (USE_MOCK) {
        // In mock mode we keep the hardcoded students
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const token = data.session?.access_token;
        if (!token) {
          setError('Session expired. Please log in again.');
          return;
        }

        const res = await api.get<ApiStudent[]>('/students/discover', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mapped = res.data.map(mapApiStudentToCard);
        setStudents(mapped);
      } catch (err) {
        console.error('Failed to load students from backend', err);
        setError(
          'Could not load students from the server. Showing sample students for now.'
        );
        setStudents(mockStudents);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const getProgressPercentage = (raised: number, goal: number) => {
    if (!goal) return 0;
    return Math.round((raised / goal) * 100);
  };

  const getUrgencyColor = (urgency: Urgency) => {
    switch (urgency) {
      case 'high':
        return 'destructive' as const;
      case 'medium':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const query = searchQuery.toLowerCase().trim();

  const filteredStudents = students.filter((student) => {
    if (!query) return true;
    return (
      student.name.toLowerCase().includes(query) ||
      student.school.toLowerCase().includes(query) ||
      student.fieldOfStudy.toLowerCase().includes(query) ||
      student.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'progress') {
      return (
        getProgressPercentage(b.raisedAmount, b.goalAmount) -
        getProgressPercentage(a.raisedAmount, a.goalAmount)
      );
    }

    if (sortBy === 'urgency') {
      const weight = (u: Urgency) =>
        u === 'high' ? 3 : u === 'medium' ? 2 : 1;
      return weight(b.urgency) - weight(a.urgency);
    }

    // 'relevance' or 'newest' currently default to original order
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Discover Students</h1>
          <p className="text-lg text-muted-foreground">
            Support verified students pursuing their educational dreams
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, school, or field of study..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="urgency">Most Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {loading && (
          <div className="mb-4 text-sm text-muted-foreground">
            Loading students...
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {sortedStudents.length} verified students
        </div>

        {/* Student Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-xl"
                onClick={() => navigate(`/students/${student.id}`)}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {student.verified && (
                      <Badge
                        variant="outline"
                        className="border-success text-success"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="mb-1 text-xl font-semibold transition-colors group-hover:text-primary">
                    {student.name}
                  </h3>
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{student.fieldOfStudy}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {student.school}
                      {student.location ? `, ${student.location}` : ''}
                    </span>
                  </div>

                  {/* Story Preview */}
                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                    {student.story}
                  </p>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {student.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        ${student.raisedAmount.toLocaleString()} raised
                      </span>
                      <span className="text-muted-foreground">
                        of ${student.goalAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={getProgressPercentage(
                        student.raisedAmount,
                        student.goalAmount
                      )}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {getProgressPercentage(
                          student.raisedAmount,
                          student.goalAmount
                        )}
                        % funded
                      </span>
                      {student.urgency === 'high' && (
                        <Badge
                          variant={getUrgencyColor(student.urgency)}
                          className="h-5 text-xs"
                        >
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-muted/30 p-4">
                  <div className="flex w-full gap-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/students/${student.id}`);
                      }}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Donate
                    </Button>

                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Students
          </Button>
        </div>
      </div>
    </div>
  );
}
