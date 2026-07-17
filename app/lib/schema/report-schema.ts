import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Report categories carry a name only. `slug` is generated server-side and is
 * read-only, and there is no `description` field on the model — do not copy one
 * across from the dashboard-category schema.
 */
export const reportCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
});

export type ReportCategoryFormValues = z.infer<typeof reportCategorySchema>;

/** Resolver lives with the schema so callers never wire up zodResolver themselves. */
export const reportCategoryResolver = zodResolver(reportCategorySchema);

/**
 * Request payloads are inferred from the schema rather than declared separately,
 * so validation and the wire type can't drift apart. Create and update are the
 * same shape here — the API accepts `name` on both, and nothing else.
 */
export type CreateReportCategoryInput = z.infer<typeof reportCategorySchema>;
export type UpdateReportCategoryInput = z.infer<typeof reportCategorySchema>;

export const reportTypeEnum = z.enum([
  'research_paper',
  'market_report',
  'climate_assessment',
  'policy_brief',
  'technical_report',
  'white_paper',
  'other',
]);

export const accessTypeEnum = z.enum(['public', 'private', 'restricted']);

export const authorRoleEnum = z.enum([
  'creator',
  'author',
  'editor',
  'reviewer',
]);

export const reportAuthorSchema = z.object({
  /** A user id on write — reads expand this into a user object. */
  user: z.string().min(1, 'Author is required'),
  role: authorRoleEnum,
});

/**
 * Write shape. Differs from the read shape on purpose: `category` is a bare id here
 * but a nested object on read, and `access` is sent as a single object even though
 * reads return an array. Both verified live 2026-07-16.
 */
export const reportSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
  description: z.string().optional().or(z.literal('')),
  abstract: z.string().optional().or(z.literal('')),
  report_type: reportTypeEnum,
  category: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  workspace: z.string().optional().nullable(),
  is_private: z.boolean().optional(),
  is_premium: z.boolean().optional(),
  price: z.string().optional(),
  tags: z.array(z.string()).optional(),
  authors: z.array(reportAuthorSchema).optional(),
  access_type: accessTypeEnum.optional(),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
export const reportResolver = zodResolver(reportSchema);

export type CreateReportInput = z.infer<typeof reportSchema>;
export type UpdateReportInput = Partial<z.infer<typeof reportSchema>>;

export const reportStatusSchema = z.object({
  status: z.enum(['DF', 'PB', 'AR']),
});

export type UpdateReportStatusInput = z.infer<typeof reportStatusSchema>;
