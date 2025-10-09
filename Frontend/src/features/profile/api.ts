import apiClient from '@/lib/axios';
import { ProfileCreateBody, ProfileCreateResponse, Profile } from './types';

export const profileApi = {
  create: async (data: ProfileCreateBody): Promise<ProfileCreateResponse> => {
    const response = await apiClient.post<ProfileCreateResponse>('/students/profile', data);
    return response.data;
  },

  getMyProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<Profile>('/students/profile/me');
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<{ fileId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ fileId: string }>('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};