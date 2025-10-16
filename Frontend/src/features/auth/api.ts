import apiClient from '@/lib/axios';

// API Types
export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'donor';
}

export interface RegisterResponse {
  userId: string;
  createdAt: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: 'student' | 'donor';
  };
}

// API Functions
export const authApi = {
  register: async (data: RegisterBody): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginBody): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', {
    username: data.email,
    password: data.password,
  });
  return response.data;
 },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/refresh');
    return response.data;
  },
};