import { z } from 'zod';
export const becomeDatasetCreatorSchema = z.object({
  affiliation: z.string(),
  expertise: z.string(),
  reason_for_joining: z.string(),
  past_work_files: z.array(z.any()).refine(
    (val) => {
      return (
        Array.isArray(val) &&
        val.every((file) => {
          return (file instanceof FileList && file.length > 0) || file === null;
        })
      );
    },
    { message: 'Please upload valid files or leave empty' },
  ),
});
export type BecomeDatasetCreatorSchema = z.infer<
  typeof becomeDatasetCreatorSchema
>;
