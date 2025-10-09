export interface UploadFileResponse {
  fileId: string;
  fileName: string;
  contentType: string;
  size: number;
}

export interface VerificationBody {
  schoolLetterId: string;
  transcriptId: string;
}

export interface VerificationResponse {
  status: 'received' | 'error';
  verificationId?: string;
}