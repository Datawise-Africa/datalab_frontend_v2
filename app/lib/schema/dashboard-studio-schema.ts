import { z } from 'zod';

export const relationshipSchema = z.object({
  left_source: z.string().min(1, 'Choose the first source'),
  left_key: z.string().min(1, 'Choose its matching field'),
  right_source: z.string().min(1, 'Choose the second source'),
  right_key: z.string().min(1, 'Choose its matching field'),
  join_type: z.enum(['left', 'right', 'inner', 'outer']),
  cardinality: z.enum([
    'one_to_one',
    'one_to_many',
    'many_to_one',
    'many_to_many',
  ]),
});
export type RelationshipFormValues = z.infer<typeof relationshipSchema>;

export const alertSchema = z.object({
  name: z.string().min(2).max(255),
  widget_id: z.string().min(1, 'Choose a KPI or visual'),
  operator: z.enum(['gt', 'gte', 'lt', 'lte', 'equals']),
  threshold: z.number(),
  recipients: z
    .string()
    .refine(
      (value) =>
        value
          .split(',')
          .every((entry) => z.string().email().safeParse(entry.trim()).success),
      'Use comma-separated email addresses'
    ),
});
export type AlertFormValues = z.infer<typeof alertSchema>;

export const commentSchema = z.object({ body: z.string().min(2).max(4000) });
export type CommentFormValues = z.infer<typeof commentSchema>;

export const refreshPolicySchema = z.object({
  frequency: z.enum(['manual', 'hourly', 'daily', 'weekly']),
  timezone: z.string().min(1),
});
export type RefreshPolicyFormValues = z.infer<typeof refreshPolicySchema>;

export const preparationStepSchema = z.object({
  operation: z.enum([
    'rename',
    'cast',
    'replace',
    'fill_missing',
    'drop_columns',
  ]),
  column: z.string().min(1, 'Choose a field'),
  target: z.string().optional(),
  value: z.string().optional(),
  strategy: z
    .enum(['value', 'mean', 'median', 'mode', 'forward', 'backward'])
    .optional(),
});
export type PreparationStepFormValues = z.infer<typeof preparationStepSchema>;

export const infographicSchema = z.object({
  title: z.string().min(2).max(120),
  subtitle: z.string().max(240),
  narrative: z.string().max(600),
  sourceNote: z.string().max(240),
  format: z.enum(['portrait', 'square', 'landscape']),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});
export type InfographicFormValues = z.infer<typeof infographicSchema>;

export const shareLinkSchema = z.object({
  access: z.enum(['view', 'interact']),
  password: z.string().max(128),
  expires_at: z.string(),
});
export type ShareLinkFormValues = z.infer<typeof shareLinkSchema>;

const sourceName = z
  .string()
  .trim()
  .min(2, 'Name this source')
  .max(255, 'Keep the name under 255 characters');

export const fileSourceSchema = z.object({
  kind: z.literal('file_upload'),
  name: sourceName,
  file: z.custom<File>(
    (value) => typeof File !== 'undefined' && value instanceof File,
    'Choose a file to upload'
  ),
});

export const datalabSourceSchema = z.object({
  kind: z.literal('datalab_dataset'),
  name: sourceName,
  dataset: z.string().trim().min(1, 'Choose or paste a dataset'),
});

export const apiSourceSchema = z.object({
  kind: z.literal('public_api'),
  name: sourceName,
  api_url: z.url({ protocol: /^https$/, error: 'Use a public HTTPS URL' }),
  records_path: z.string().trim(),
});

export const connectSourceSchema = z.discriminatedUnion('kind', [
  fileSourceSchema,
  datalabSourceSchema,
  apiSourceSchema,
]);
export type ConnectSourceFormValues = z.infer<typeof connectSourceSchema>;
export type DataSourceKind = ConnectSourceFormValues['kind'];
