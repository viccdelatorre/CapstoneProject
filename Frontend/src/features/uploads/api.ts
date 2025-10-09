import apiClient from '@/lib/axios';
import { UploadFileResponse, VerificationBody, VerificationResponse } from './types';

export const uploadApi = {
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadFileResponse>('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  submitVerification: async (data: VerificationBody): Promise<VerificationResponse> => {
    const response = await apiClient.post<VerificationResponse>('/students/verification', data);
    return response.data;
  },
};