import { z } from 'zod';

// ── Step 1: Basic Information ──
export const datasetBasicInfoSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    category: z.coerce.number().positive('Category is required'),
    is_premium: z.boolean().default(false),
    price: z.coerce.number().min(0).nullable().default(null),
    is_private: z.boolean().default(false),
  })
  .refine((d) => !d.is_premium || (d.price !== null && d.price > 0), {
    message: 'Price is required for premium datasets',
    path: ['price'],
  });

export type DatasetBasicInfoInput = z.infer<typeof datasetBasicInfoSchema>;

// ── Step 2: Files ──
export const datasetFileSchema = z.object({
  file_name: z.string(),
  base64: z.string(),
});

export type DatasetFileInput = z.infer<typeof datasetFileSchema>;

export const datasetFilesSchema = z.object({
  data_files: z
    .array(datasetFileSchema)
    .min(1, 'At least one data file is required'),
  metadata_files: z.array(datasetFileSchema).optional().default([]),
  datasheet_files: z.array(datasetFileSchema).optional().default([]),
});

export type DatasetFilesInput = z.infer<typeof datasetFilesSchema>;

// ── Step 3: Attribution ──
export const newAuthorSchema = z.object({
  title: z.string().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email required'),
  affiliation: z.string().min(1, 'Affiliation is required'),
});

export type NewAuthorInput = z.infer<typeof newAuthorSchema>;

export const datasetAttributionSchema = z.object({
  authors: z.array(z.coerce.number()).default([]),
  new_authors: z.array(newAuthorSchema).default([]),
  doi_citation: z.string().optional(),
  license: z.coerce.number().nullable().default(null),
});

export type DatasetAttributionInput = z.infer<typeof datasetAttributionSchema>;

// ── Step 4: Discovery ──
export const datasetDiscoverySchema = z.object({
  keywords: z
    .array(z.string().min(2).max(100))
    .min(2, 'At least 2 keywords required'),
  tags: z.array(z.string().min(2).max(100)).min(2, 'At least 2 tags required'),
  origin_region: z.string().optional(),
  covered_regions: z
    .array(z.string().min(1))
    .min(1, 'At least one region required'),
  audience_data: z.object({
    students: z.boolean().default(false),
    non_profit: z.boolean().default(false),
    company: z.boolean().default(false),
    public: z.boolean().default(false),
  }),
});

export type DatasetDiscoveryInput = z.infer<typeof datasetDiscoverySchema>;

// ── Step 5: Terms ──
export const datasetTermsSchema = z.object({
  data_accuracy: z.boolean().refine((v) => v, 'You must confirm data accuracy'),
  responsible_use: z
    .boolean()
    .refine((v) => v, 'You must agree to responsible use'),
  privacy_compliance: z
    .boolean()
    .refine((v) => v, 'You must confirm privacy compliance'),
  rights_ownership: z
    .boolean()
    .refine((v) => v, 'You must confirm rights ownership'),
});

export type DatasetTermsInput = z.infer<typeof datasetTermsSchema>;

// ── Combined payload ──
export const uploadDatasetSchema = z.object({
  step_1: datasetBasicInfoSchema,
  step_2: datasetFilesSchema,
  step_3: datasetAttributionSchema,
  step_4: datasetDiscoverySchema,
  step_5: z.object({ accepted_terms: datasetTermsSchema }),
});

export type UploadDatasetPayload = z.infer<typeof uploadDatasetSchema>;
