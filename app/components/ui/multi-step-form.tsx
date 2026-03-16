import { useState, type ReactNode } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export interface StepConfig {
  /** Unique key for the step. */
  key: string;
  /** Label shown in the stepper. */
  label: string;
  /** Icon shown in the stepper (optional). */
  icon?: React.ComponentType<{ className?: string }>;
  /** Validate before allowing navigation to next step. Return true to allow. */
  validate?: () => boolean | Promise<boolean>;
}

interface MultiStepFormProps {
  /** Step configuration array. */
  steps: StepConfig[];
  /** Render function for each step. Receives the step key and index. */
  children: (step: StepConfig, index: number) => ReactNode;
  /** Called when the final step's submit button is clicked. */
  onSubmit: () => void | Promise<void>;
  /** Whether submission is in progress. */
  isSubmitting?: boolean;
  /** Label for the final submit button. Defaults to "Submit". */
  submitLabel?: string;
  /** Label for the next button. Defaults to "Next". */
  nextLabel?: string;
  /** Label for the previous button. Defaults to "Previous". */
  prevLabel?: string;
  /** Whether to wrap each step content in a Card. Defaults to true. */
  showCard?: boolean;
  /** Additional class for the root container. */
  className?: string;
  /** Error message to show below the form. */
  error?: string;
  /** Extra actions to show next to the navigation buttons (e.g. "Save Draft"). */
  extraActions?: (currentStep: number) => ReactNode;
}

/**
 * A reusable, configurable multi-step form component.
 *
 * @example
 * ```tsx
 * <MultiStepForm
 *   steps={[
 *     { key: 'info', label: 'Basic Info', validate: () => !!title },
 *     { key: 'files', label: 'Files' },
 *     { key: 'review', label: 'Review' },
 *   ]}
 *   onSubmit={handleSubmit}
 *   isSubmitting={isPending}
 *   submitLabel="Publish"
 * >
 *   {(step) => {
 *     switch (step.key) {
 *       case 'info': return <InfoStep />;
 *       case 'files': return <FilesStep />;
 *       case 'review': return <ReviewStep />;
 *     }
 *   }}
 * </MultiStepForm>
 * ```
 */
export function MultiStepForm({
  steps,
  children,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit',
  nextLabel = 'Next',
  prevLabel = 'Previous',
  showCard = true,
  className,
  error,
  extraActions,
}: MultiStepFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStep = steps[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  const handleNext = async () => {
    if (currentStep.validate) {
      const valid = await currentStep.validate();
      if (!valid) return;
    }
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = async () => {
    if (currentStep.validate) {
      const valid = await currentStep.validate();
      if (!valid) return;
    }
    await onSubmit();
  };

  const content = children(currentStep, currentIndex);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stepper */}
      <div className="flex gap-1">
        {steps.map((step, i) => {
          const isActive = i === currentIndex;
          const isDone = i < currentIndex;
          return (
            <div key={step.key} className="flex-1">
              <div
                className={cn(
                  'h-1.5 rounded-full transition-colors',
                  isDone
                    ? 'bg-primary'
                    : isActive
                      ? 'bg-primary/80'
                      : 'bg-muted'
                )}
              />
              <div className="mt-1.5 flex items-center justify-center gap-1">
                {step.icon && (
                  <step.icon
                    className={cn(
                      'h-3.5 w-3.5',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                )}
                <p
                  className={cn(
                    'text-xs text-center',
                    isActive
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      {showCard ? (
        <Card>
          <CardContent className="p-6">{content}</CardContent>
        </Card>
      ) : (
        content
      )}

      {/* Error */}
      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={isFirst} onClick={handlePrev}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {prevLabel}
        </Button>

        <div className="flex items-center gap-2">
          {extraActions?.(currentIndex)}

          {isLast ? (
            <Button
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleNext}
            >
              {nextLabel}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
