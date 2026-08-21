import { z } from 'zod';

export const dashboardStatusSchema = z.enum(['DF', 'PB', 'AR']);

export const createDashboardSchema = z
  .object({
    builder_mode: z.enum(['external', 'native']).default('native'),
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be at most 255 characters'),
    description: z.string().optional().or(z.literal('')),
    dashboard_url: z
      .url('Enter a valid URL')
      .max(200, 'URL must be at most 200 characters')
      .optional()
      .or(z.literal('')),
    category: z.string().optional().nullable(),
    workspace: z.string().optional().nullable(),
    is_public: z.boolean().optional(),
    thumbnail: z.string().optional().nullable(),
    status: dashboardStatusSchema.optional(),
    tags: z.array(z.string().min(1)).default([]),
  })
  .superRefine((value, context) => {
    if (value.builder_mode === 'external' && !value.dashboard_url) {
      context.addIssue({
        code: 'custom',
        path: ['dashboard_url'],
        message: 'An embed URL is required for an external dashboard',
      });
    }
  });

export type CreateDashboardFormValues = z.infer<typeof createDashboardSchema>;

export const updateDashboardSchema = z.object({
  builder_mode: z.enum(['external', 'native']).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  dashboard_url: z.url().max(200).optional().or(z.literal('')),
  category: z.string().optional().nullable(),
  workspace: z.string().optional().nullable(),
  is_public: z.boolean().optional(),
  thumbnail: z.string().optional().nullable(),
  status: dashboardStatusSchema.optional(),
  tags: z.array(z.string().min(1)).optional(),
});
export type UpdateDashboardFormValues = z.infer<typeof updateDashboardSchema>;

export const dashboardCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

export type DashboardCategoryFormValues = z.infer<
  typeof dashboardCategorySchema
>;
