import { http, HttpResponse } from 'msw';

// Type definitions for mock data
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'donor';
  createdAt: string;
}

interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  story: string;
  goals: Array<{ title: string; targetAmount: number; description?: string }>;
  country: string;
  school: string;
  program: string;
  profileImageId?: string;
  createdAt: string;
}

interface FileRecord {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

interface Verification {
  id: string;
  userId: string;
  schoolLetterId: string;
  transcriptId: string;
  status: 'received' | 'error';
  createdAt: string;
}

// Mock data storage using sessionStorage for persistence
const getStorageData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = sessionStorage.getItem(`msw_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`msw_${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to sessionStorage:', error);
  }
};

// Initialize mock data
let users: User[] = getStorageData('users', [
  // Demo user for testing
  {
    id: 'demo-user-1',
    email: 'student@demo.com',
    firstName: 'Demo',
    lastName: 'Student',
    role: 'student' as const,
    createdAt: new Date().toISOString(),
  }
]);
let profiles: Profile[] = getStorageData('profiles', []);
let files: FileRecord[] = getStorageData('files', []);
let verifications: Verification[] = getStorageData('verifications', []);

// Helper functions to save data
const saveUsers = () => setStorageData('users', users);
const saveProfiles = () => setStorageData('profiles', profiles);
const saveFiles = () => setStorageData('files', files);
const saveVerifications = () => setStorageData('verifications', verifications);

// Generate mock token
const generateToken = (userId: string) => `mock-token-${userId}`;
const getUserFromToken = (authHeader: string | null): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('mock-token-', '');
  return users.find((u: User) => u.id === userId) ? userId : null;
};

export const handlers = [
  // Auth endpoints - Updated to match the actual API calls
  http.post('http://localhost:8000/auth/register', async ({ request }) => {
    const body = await request.json() as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: 'student' | 'donor';
    };

    // Check if user already exists
    if (users.find((u: User) => u.email === body.email)) {
      return HttpResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    saveUsers();

    return HttpResponse.json({
      userId: user.id,
      createdAt: user.createdAt,
    });
  }),

  http.post('http://localhost:8000/auth/login', async ({ request }) => {
    console.log('🚀 Login request received');
    const body = await request.json() as { email: string; password: string };
    console.log('📧 Login attempt for:', body.email);
    console.log('👥 Available users:', users.map(u => u.email));

    const user = users.find((u: User) => u.email === body.email);
    if (!user) {
      console.log('❌ User not found');
      return HttpResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ User found, generating token');
    return HttpResponse.json({
      accessToken: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  }),

  http.post('http://localhost:8000/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  http.post('http://localhost:8000/auth/refresh', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const userId = getUserFromToken(authHeader);

    if (!userId) {
      return HttpResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = users.find((u: User) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json({
      accessToken: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  }),

  // Profile endpoints
  http.post('http://localhost:8000/students/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const userId = getUserFromToken(authHeader);

    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if profile already exists
    if (profiles.find((p: Profile) => p.userId === userId)) {
      return HttpResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    const body = await request.json() as {
      displayName: string;
      bio: string;
      story: string;
      goals: Array<{ title: string; targetAmount: number; description?: string }>;
      country: string;
      school: string;
      program: string;
      profileImageId?: string;
    };

    const profile: Profile = {
      id: `profile-${Date.now()}`,
      userId,
      ...body,
      createdAt: new Date().toISOString(),
    };

    profiles.push(profile);
    saveProfiles();

    return HttpResponse.json({
      profileId: profile.id,
    });
  }),

  http.get('http://localhost:8000/students/profile/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const userId = getUserFromToken(authHeader);

    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = profiles.find((p: Profile) => p.userId === userId);
    if (!profile) {
      return HttpResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { userId: _, ...profileData } = profile;
    return HttpResponse.json(profileData);
  }),

  // File upload endpoints
  http.post('http://localhost:8000/files', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const userId = getUserFromToken(authHeader);

    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return HttpResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Simulate file validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return HttpResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return HttpResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const fileRecord: FileRecord = {
      id: `file-${Date.now()}`,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    files.push(fileRecord);
    saveFiles();

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return HttpResponse.json({
      fileId: fileRecord.id,
      fileName: fileRecord.fileName,
      contentType: fileRecord.contentType,
      size: fileRecord.size,
    });
  }),

  // Verification endpoints
  http.post('http://localhost:8000/students/verification', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const userId = getUserFromToken(authHeader);

    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as {
      schoolLetterId: string;
      transcriptId: string;
    };

    // Validate file IDs exist
    const schoolLetterFile = files.find((f: FileRecord) => f.id === body.schoolLetterId);
    const transcriptFile = files.find((f: FileRecord) => f.id === body.transcriptId);

    if (!schoolLetterFile || !transcriptFile) {
      return HttpResponse.json(
        { error: 'Invalid file IDs' },
        { status: 400 }
      );
    }

    const verification: Verification = {
      id: `verification-${Date.now()}`,
      userId,
      schoolLetterId: body.schoolLetterId,
      transcriptId: body.transcriptId,
      status: 'received' as const,
      createdAt: new Date().toISOString(),
    };

    verifications.push(verification);
    saveVerifications();

    return HttpResponse.json({
      status: verification.status,
      verificationId: verification.id,
    });
  }),

  // File serving endpoint (for profile images)
  http.get('http://localhost:8000/files/:fileId', ({ params }) => {
    const { fileId } = params as { fileId: string };
    const file = files.find((f: FileRecord) => f.id === fileId);

    if (!file) {
      return HttpResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Return a placeholder image URL for profile images
    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://via.placeholder.com/150x150.png?text=${encodeURIComponent(file.fileName)}`,
      },
    });
  }),
];