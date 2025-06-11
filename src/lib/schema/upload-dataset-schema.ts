// import { createStep, createSteps } from '@/hooks/use-stepper';
// import { BellIcon, PaperclipIcon, UserIcon } from 'lucide-react';
import { z } from 'zod';

const datasetUploadBasicInfoSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, 'Title is required'),
    description: z
      .string({ required_error: 'Description is required' })
      .min(1, 'Description is required'),
    category: z
      .string({ required_error: 'Category is required' })
      .min(1, 'Category is required'),
    is_premium: z.coerce.boolean().default(false),
    price: z.coerce
      .number()
      .min(0, 'Price must be a positive number')
      .optional(),
    is_private: z.coerce.boolean().default(false),
  })
  .strict();
export type DatasetUploadBasicInfoSchemaType = z.infer<
  typeof datasetUploadBasicInfoSchema
>;
const datasetFileSchema = z.object({
  file_name: z
    .string({ required_error: 'File name is required' })
    .min(1, 'File name is required'),
  base64: z
    .string({ required_error: 'File base64 is required' })
    .min(1, 'File base64 is required'),
});

const datasetFilesSchema = z.object({
  data_files: z.array(datasetFileSchema),
  metadata_files: z.array(datasetFileSchema).optional(),
  datasheet_files: z.array(datasetFileSchema).optional(),
});

const datasetUploadAuthorSchema = z.object({
  title: z.string({required_error: 'Author title is required'}).min(1, 'Author title is required'),
  first_name: z.string({required_error: 'Author first name is required'}).min(1, 'Author first name is required'),
  last_name: z.string({required_error: 'Author last name is required'}).min(1, 'Author last name is required'),
  email: z.string({required_error: 'Invalid email address'}).email('Invalid email address'),
  affiliation: z.string({required_error: 'Author affiliation is required'}).min(1, 'Author affiliation is required'),
});

export type DatasetUploadAuthorSchemaType = z.infer<
  typeof datasetUploadAuthorSchema
>;

const attributionSchema = z.object({
  authors: z
    .array(datasetUploadAuthorSchema)
    .min(1, 'At least one author is required'),
  doi_citation: z.string().url().optional(),
  license: z.string().min(1, 'License is required'),
});
const uploadDatasetDiscoveryInfoSchema = z.object({
  keywords: z.array(z.string().min(2).max(100)),
  tags: z.array(z.string().min(2).max(100)),
  origin_region: z.string().min(2).max(100),
  covered_regions: z.array(z.string().min(2).max(100)),
  audience_data: z.object({
    students: z.coerce.boolean().default(false),
    non_profit: z.coerce.boolean().default(false),
    company: z.coerce.boolean().default(false),
    public: z.coerce.boolean().default(false),
  }),
});

export const uploadDatasetReviewSchema = z.object({
  data_accuracy: z.coerce.boolean().default(false),
  responsible_use: z.coerce.boolean().default(false),
  privacy_compliance: z.coerce.boolean().default(false),
  rights_ownership: z.coerce.boolean().default(false),
});

// export const uploadDatasetSchemaSteps = createSteps([
//   createStep({
//     label: 'Basic Info',
//     description: 'Your basic information',
//     schema: datasetUploadBasicInfoSchema,
//     Icon: UserIcon,
//     key: 'basic_info',
//   }),
//   createStep({
//     label: 'Dataset Files',
//     description: 'Your dataset files',
//     schema: datasetFilesSchema,
//     Icon: PaperclipIcon,
//     key: 'dataset_files',
//   }),
//   createStep({
//     label: 'Attribution',
//     description: 'Dataset attribution & Citation',
//     schema: attributionSchema,
//     Icon: BellIcon,
//     key: 'attribution',
//   }),
//   createStep({
//     label: 'Discovery Info',
//     description: 'Dataset discovery information',
//     schema: uploadDatasetDiscoveryInfoSchema,
//     Icon: BellIcon,
//     key: 'discovery_info',
//   }),
//   createStep({
//     label: 'Review & Finalize',
//     description: 'Review your dataset information',
//     schema: uploadDatasetReviewSchema,
//     Icon: BellIcon,
//     key: 'review',
//   }),
// ]);

export const uploadDatasetSchema = z.object({
  step_1: datasetUploadBasicInfoSchema,
  step_2: datasetFilesSchema,
  step_3: attributionSchema,
  step_4: uploadDatasetDiscoveryInfoSchema,
  step_5: uploadDatasetReviewSchema,
});
// datasetUploadBasicInfoSchema
//     .merge(datasetFilesSchema)
//     .merge(attributionSchema)
//     .merge(uploadDatasetDiscoveryInfoSchema)
//     .strict();
export type UploadDatasetSchemaType = z.infer<typeof uploadDatasetSchema>;
