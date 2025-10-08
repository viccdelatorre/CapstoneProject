import { z } from 'zod';

const goalSchema = z.object({
  title: z.string().min(1, 'Goal title is required').max(100, 'Goal title too long'),
  targetAmount: z
    .number()
    .min(0, 'Target amount must be non-negative')
    .max(1000000, 'Target amount too large'),
  description: z.string().max(500, 'Goal description too long').optional(),
});

export const profileCreateSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name too long'),
  bio: z
    .string()
    .min(1, 'Bio is required')
    .max(500, 'Bio cannot exceed 500 characters'),
  story: z
    .string()
    .min(1, 'Story is required')
    .max(1500, 'Story cannot exceed 1500 characters'),
  goals: z
    .array(goalSchema)
    .min(1, 'At least one goal is required')
    .max(5, 'Maximum 5 goals allowed'),
  country: z.string().min(1, 'Country is required'),
  school: z.string().min(1, 'School is required'),
  program: z.string().min(1, 'Program is required'),
  profileImage: z.instanceof(File).optional(),
});

export type ProfileCreateFormData = z.infer<typeof profileCreateSchema>;