import { z } from 'zod';

export const becomeDatasetCreatorSchema = z.object({
  affiliation: z.string().min(1, 'Affiliation is required'),
  expertise: z.string().min(1, 'Expertise is required'),
  reason_for_joining: z
    .string()
    .min(10, 'Please provide a detailed reason (at least 10 characters)'),
  past_work_files: z.array(z.string()).optional(),
});

export type BecomeDatasetCreatorInput = z.infer<
  typeof becomeDatasetCreatorSchema
>;
