import { z } from 'zod';
export const becomeDatasetCreatorSchema = z.object({
  affiliation: z.string(),
  expertise: z.string(),
  reason_for_joining: z.string(),
  past_work_files: z.array(z.string()).optional(),
  // past_work_files: z.instanceof(FileList).optional(),
});
export type BecomeDatasetCreatorSchema = z.infer<
  typeof becomeDatasetCreatorSchema
>;
