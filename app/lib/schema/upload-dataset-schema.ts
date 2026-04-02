import { z } from 'zod';

// ── Enums ──

export const datasetTypeEnum = z.enum([
  'tabular',
  'image',
  'text',
  'audio',
  'video',
  'geospatial',
  'time_series',
  'other',
]);

export type DatasetType = z.infer<typeof datasetTypeEnum>;

export const authorRoleEnum = z.enum(['creator', 'contributor', 'maintainer']);

export type AuthorRole = z.infer<typeof authorRoleEnum>;

export const accessTypeEnum = z.enum(['public', 'private', 'restricted']);

export type AccessType = z.infer<typeof accessTypeEnum>;

// ── Sub-schemas ──

export const datasetAuthorSchema = z.object({
  user: z.string().min(1, 'User ID is required'),
  role: authorRoleEnum.default('creator'),
});

export type DatasetAuthorInput = z.infer<typeof datasetAuthorSchema>;

export const datasetAccessSchema = z.object({
  access_type: accessTypeEnum.default('public'),
  access_instructions: z.string().optional(),
});

export type DatasetAccessInput = z.infer<typeof datasetAccessSchema>;

export const datasetDatasheetSchema = z.object({
  motivation: z.string().optional(),
  composition: z.string().optional(),
  collection_process: z.string().optional(),
  preprocessing: z.string().optional(),
  uses: z.string().optional(),
  distribution: z.string().optional(),
  maintenance: z.string().optional(),
});

export type DatasetDatasheetInput = z.infer<typeof datasetDatasheetSchema>;

// ── Upload dataset form schema ──
// Single schema for form validation and API submission.
// category/license use z.coerce.number() — the form converts select string
// values to numbers on change, so the payload is always clean numbers.
// No .default() — all defaults are provided by useForm's defaultValues.

export const uploadDatasetFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dataset_type: datasetTypeEnum,
  category: z
    .string('Please select dataset category')
    .min(1, 'Category is required'), // Allow empty string for optional category
  license: z.string('Please select a license').min(1, 'License is required'),
  workspace: z.string().optional(),
  dataset_image: z.string().optional(),
  is_premium: z.boolean(),
  is_private: z.boolean(),
  tags: z.array(z.string().min(1).max(100)),
  authors: z
    .array(
      z.object({
        user: z.string().min(1, 'User ID is required'),
        role: authorRoleEnum,
      })
    )
    .min(1, 'At least one author is required'),
  access: z.object({
    access_type: accessTypeEnum,
    access_instructions: z.string().optional(),
  }),
  datasheet: datasetDatasheetSchema.optional(),
});

export type UploadDatasetFormValues = z.infer<typeof uploadDatasetFormSchema>;

// ── Legacy schemas (kept for backward compatibility) ──

/** @deprecated Use createDatasetSchema instead */
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

/** @deprecated Files now upload via presigned URLs after version creation */
export const datasetFileSchema = z.object({
  file_name: z.string(),
  base64: z.string(),
});

export type DatasetFileInput = z.infer<typeof datasetFileSchema>;

/** @deprecated Files now upload via presigned URLs after version creation */
export const datasetFilesSchema = z.object({
  data_files: z
    .array(datasetFileSchema)
    .min(1, 'At least one data file is required'),
  metadata_files: z.array(datasetFileSchema).optional().default([]),
  datasheet_files: z.array(datasetFileSchema).optional().default([]),
});

export type DatasetFilesInput = z.infer<typeof datasetFilesSchema>;

export const newAuthorSchema = z.object({
  title: z.string().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email('Valid email required'),
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

/** @deprecated Use createDatasetSchema + versioned upload flow instead */
export const uploadDatasetSchema = z.object({
  step_1: datasetBasicInfoSchema,
  step_2: datasetFilesSchema,
  step_3: datasetAttributionSchema,
  step_4: datasetDiscoverySchema,
  step_5: z.object({ accepted_terms: datasetTermsSchema }),
});

export type UploadDatasetPayload = z.infer<typeof uploadDatasetSchema>;
