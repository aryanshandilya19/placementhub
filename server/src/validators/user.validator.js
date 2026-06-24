import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),
  profile: z.object({
    college: z.string().trim().max(100).optional(),
    branch: z.string().trim().max(100).optional(),
    graduationYear: z.number().int().min(2000).max(2030).optional(),
    skills: z.array(z.string().trim()).max(20).optional(),
    bio: z.string().trim().max(300).optional(),
    linkedin: z.string().trim().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    github: z.string().trim().url('Invalid GitHub URL').optional().or(z.literal('')),
    leetcode: z.string().trim().url('Invalid LeetCode URL').optional().or(z.literal('')),
  }).optional(),
});