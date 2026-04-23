import { z } from 'zod';

export const dashboardStatusSchema = z.enum(['DF', 'PB', 'AR']);

export const createDashboardSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be at most 255 characters'),
  description: z.string().max(2000).optional().or(z.literal('')),
  dashboard_url: z.string().url('Enter a valid URL'),
  category: z.string().optional().nullable(),
  workspace: z.string().optional().nullable(),
  is_public: z.boolean().optional(),
  thumbnail: z.string().optional().nullable(),
  status: dashboardStatusSchema.optional(),
  tags: z.array(z.string().min(1)).default([]),
});

export type CreateDashboardFormValues = z.infer<typeof createDashboardSchema>;

export const updateDashboardSchema = createDashboardSchema.partial();
export type UpdateDashboardFormValues = z.infer<typeof updateDashboardSchema>;
