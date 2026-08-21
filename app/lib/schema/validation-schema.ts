import { z } from 'zod';

const manualCheckKeys = [
  'ownership_rights',
  'privacy_personal_data',
  'quality_accuracy',
  'documentation',
  'licensing',
  'ethical_risk',
  'accessibility',
] as const;

export const validationDecisionSchema = z
  .object({
    decision: z.enum(['approved', 'changes_requested', 'rejected']),
    reviewer_notes: z.string(),
    override_automated_checks: z.boolean(),
    ownership_rights: z.boolean(),
    privacy_personal_data: z.boolean(),
    quality_accuracy: z.boolean(),
    documentation: z.boolean(),
    licensing: z.boolean(),
    ethical_risk: z.boolean(),
    accessibility: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.decision !== 'approved') return;
    for (const key of manualCheckKeys) {
      if (!values[key]) {
        context.addIssue({
          code: 'custom',
          path: [key],
          message: 'Required before approval',
        });
      }
    }
  });

export type ValidationDecisionFormValues = z.infer<
  typeof validationDecisionSchema
>;
