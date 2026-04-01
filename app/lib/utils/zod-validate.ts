import type { StepValidationResult } from '~/components/ui/multi-step-form';

type ZodLike = {
  safeParse: (data: unknown) => {
    success: boolean;
    error?: { issues: { path: PropertyKey[]; message: string }[] };
  };
};

/**
 * Runs a Zod (or Zod-compatible) schema against data and returns a
 * `StepValidationResult` for use with `MultiStepForm` step validators.
 */
export function zodValidate(
  schema: ZodLike,
  data: unknown
): StepValidationResult {
  const result = schema.safeParse(data);
  if (result.success) return { valid: true };
  const errors: Record<string, string> = {};
  for (const issue of result.error!.issues) {
    const key = issue.path.map(String).join('.') || '_form';
    if (!errors[key]) errors[key] = issue.message;
  }
  return { valid: false, errors };
}
