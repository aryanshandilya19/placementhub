import { z } from 'zod';

export const createApplicationSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(100),
  role: z.string().trim().min(1, 'Role is required').max(100),
  status: z.enum(['applied', 'oa', 'interview', 'offer', 'rejected', 'ghosted']).optional(),
  appliedDate: z.string().optional(),
  ctc: z.number().min(0).optional(),
  location: z.string().trim().max(100).optional(),
  jobLink: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().trim().max(1000).optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const addRoundSchema = z.object({
  type: z.enum(['oa', 'technical', 'hr', 'managerial', 'group_discussion']),
  date: z.string().optional(),
  outcome: z.enum(['passed', 'failed', 'pending']).optional(),
  notes: z.string().trim().max(500).optional(),
});