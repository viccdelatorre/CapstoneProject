import { z } from 'zod';

export const uploadVerificationSchema = z.object({
  schoolLetter: z.instanceof(File, { message: 'School letter is required' }),
  transcript: z.instanceof(File, { message: 'Transcript is required' }),
});

export type UploadVerificationFormData = z.infer<typeof uploadVerificationSchema>;