import { z } from 'zod';

export const addProblemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  platform: z.enum(['leetcode', 'gfg', 'codeforces', 'codechef', 'other']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string().trim()).max(10).optional(),
  status: z.enum(['todo', 'solving', 'done']).optional(),
  link: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().trim().max(500).optional(),
  solvedAt: z.string().optional(),
});

export const updateProblemSchema = addProblemSchema.partial();