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
    category: z.coerce
      .number({
        message: 'Please select a valid category',
        required_error: 'Category is required',
      })
      .positive('Invalid category selected'),
    is_premium: z.coerce.boolean().default(false),
    price: z.coerce
      .number()
      .min(0, 'Price must be a positive number')
      .optional(),
    is_private: z.coerce.boolean().default(false),
  })
  .strict()
  .refine(
    (data) =>
      !data.is_premium ||
      (data.is_premium && data.price !== undefined) ||
      (data.price ?? 0) <= 0,
    {
      message: 'Price is required for premium datasets',
    },
  );
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
  // .min(1, 'At least one data file is required'),
  metadata_files: z.array(datasetFileSchema).optional(),
  datasheet_files: z.array(datasetFileSchema).optional(),
});

const datasetUploadAuthorSchema = z.object({
  title: z
    .string({ required_error: 'Author title is required' })
    .min(1, 'Author title is required'),
  first_name: z
    .string({ required_error: 'Author first name is required' })
    .min(1, 'Author first name is required'),
  last_name: z
    .string({ required_error: 'Author last name is required' })
    .min(1, 'Author last name is required'),
  email: z
    .string({ required_error: 'Invalid email address' })
    .email('Invalid email address'),
  affiliation: z
    .string({ required_error: 'Author affiliation is required' })
    .min(1, 'Author affiliation is required'),
});

export type DatasetUploadAuthorSchemaType = z.infer<
  typeof datasetUploadAuthorSchema
>;

const attributionSchema = z.object({
  authors: z.array(z.coerce.number()).default([]),
  new_authors: z.array(datasetUploadAuthorSchema),
  doi_citation: z.string().optional(),
  license: z.coerce
    .number({
      required_error: 'License is required',
      message: 'License is required',
    })
    .positive('Invalid license selected')
    .optional(),
});
const uploadDatasetDiscoveryInfoSchema = z.object({
  keywords: z.array(z.string().min(2).max(100)),
  tags: z.array(z.string().min(2).max(100)),
  origin_region: z
    .string({
      required_error: 'Origin region is required',
      message: 'Origin region is required',
    })
    .optional(),
  covered_regions: z.array(z.string().nonempty('Covered region is required')),
  audience_data: z.object({
    students: z.coerce.boolean().default(false),
    non_profit: z.coerce.boolean().default(false),
    company: z.coerce.boolean().default(false),
    public: z.coerce.boolean().default(false),
  }),
});

export const uploadDatasetReviewSchema = z.object({
  accepted_terms: z.object({
    data_accuracy: z.coerce.boolean().default(false),
    responsible_use: z.coerce.boolean().default(false),
    privacy_compliance: z.coerce.boolean().default(false),
    rights_ownership: z.coerce.boolean().default(false),
  }),
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
