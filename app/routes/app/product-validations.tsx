import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  CheckCircle2,
  Loader2,
  RotateCw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Protect } from '~/components/auth/protect';
import {
  FormCheckboxField,
  FormPickerField,
  FormTextareaField,
} from '~/components/form-fields';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Form } from '~/components/ui/form';
import { Picker } from '~/components/ui/picker';
import {
  useDecideValidation,
  useRerunValidationChecks,
  useStartValidationReview,
  useValidations,
} from '~/features/validations';
import {
  validationDecisionSchema,
  type ValidationDecisionFormValues,
} from '~/lib/schema/validation-schema';
import type { ProductValidation } from '~/lib/types/validation';

const manualChecks = [
  ['ownership_rights', 'Ownership and publishing rights confirmed'],
  ['privacy_personal_data', 'Privacy and personal-data risks checked'],
  ['quality_accuracy', 'Quality and accuracy reviewed'],
  ['documentation', 'Documentation is sufficient'],
  ['licensing', 'License is appropriate'],
  ['ethical_risk', 'Ethical and harm risks checked'],
  ['accessibility', 'Public presentation is accessible'],
] as const;

const defaults: ValidationDecisionFormValues = {
  decision: 'approved',
  reviewer_notes: '',
  override_automated_checks: false,
  ownership_rights: false,
  privacy_personal_data: false,
  quality_accuracy: false,
  documentation: false,
  licensing: false,
  ethical_risk: false,
  accessibility: false,
};

export default function ProductValidations() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState<ProductValidation | null>(null);
  const { data, isLoading } = useValidations({
    status: statusFilter === 'all' ? undefined : statusFilter,
    product_type: typeFilter === 'all' ? undefined : typeFilter,
  });
  const startReview = useStartValidationReview();
  const rerun = useRerunValidationChecks();
  const decide = useDecideValidation();
  const form = useForm<ValidationDecisionFormValues>({
    resolver: zodResolver(validationDecisionSchema),
    defaultValues: defaults,
  });

  const submitDecision = (values: ValidationDecisionFormValues) => {
    if (!selected) return;
    const manual_checklist = Object.fromEntries(
      manualChecks.map(([key]) => [key, values[key]])
    );
    decide.mutate({
      id: selected.id,
      input: {
        decision: values.decision,
        reviewer_notes: values.reviewer_notes,
        override_automated_checks: values.override_automated_checks,
        manual_checklist,
      },
    });
  };

  return (
    <Protect roles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Publication validation</h1>
            <p className="text-muted-foreground">
              Review automated findings and complete the human publication
              checklist.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Picker
            value={statusFilter}
            onChange={(value) => setStatusFilter(value ?? 'all')}
            items={[
              { label: 'All statuses', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'In review', value: 'in_review' },
              { label: 'Changes requested', value: 'changes_requested' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ]}
            className="w-48"
          />
          <Picker
            value={typeFilter}
            onChange={(value) => setTypeFilter(value ?? 'all')}
            items={[
              { label: 'All product types', value: 'all' },
              { label: 'Datasets', value: 'dataset' },
              { label: 'Reports', value: 'report' },
              { label: 'Dashboards', value: 'dashboard' },
            ]}
            className="w-48"
          />
        </div>

        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)]">
            <div className="space-y-3">
              {(data?.data ?? []).map((validation) => (
                <button
                  type="button"
                  key={validation.id}
                  onClick={() => {
                    setSelected(validation);
                    form.reset({
                      ...defaults,
                      reviewer_notes: validation.reviewer_notes,
                      ...validation.manual_checklist,
                    });
                  }}
                  className="w-full rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {validation.product?.title ?? 'Deleted product'}
                      </p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {validation.product_type}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {validation.status.replaceAll('_', ' ')}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm">
                    Automated score: {validation.automated_score}%
                  </p>
                </button>
              ))}
              {!data?.data.length && (
                <p className="rounded-xl border p-8 text-center text-muted-foreground">
                  No reviews match these filters.
                </p>
              )}
            </div>

            {selected && (
              <Card>
                <CardHeader>
                  <CardTitle>{selected.product?.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    {selected.automated_checks.map((check) => (
                      <div key={check.key} className="flex gap-2 text-sm">
                        {check.passed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        )}
                        <span>
                          <strong>{check.label}:</strong> {check.detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startReview.mutate({ id: selected.id })}
                    >
                      Start review
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => rerun.mutate({ id: selected.id })}
                    >
                      <RotateCw className="mr-2 h-4 w-4" /> Rerun checks
                    </Button>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(submitDecision)}
                      className="space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3 border-t pt-4">
                        <div>
                          <p className="font-medium">Required manual checks</p>
                          <p className="text-sm text-muted-foreground">
                            Automated readiness does not replace human review.
                            Every item must be confirmed before approval.
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            manualChecks.forEach(([key]) =>
                              form.setValue(key, true, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            )
                          }
                        >
                          Mark all complete
                        </Button>
                      </div>
                      {manualChecks.map(([key, label]) => (
                        <FormCheckboxField
                          key={key}
                          control={form.control}
                          name={key}
                          label={label}
                        />
                      ))}
                      <FormCheckboxField
                        control={form.control}
                        name="override_automated_checks"
                        label="Override failed automated checks"
                        description="Requires an explanation in reviewer notes."
                      />
                      <FormPickerField
                        control={form.control}
                        name="decision"
                        label="Decision"
                        options={[
                          { label: 'Approve', value: 'approved' },
                          {
                            label: 'Request changes',
                            value: 'changes_requested',
                          },
                          { label: 'Reject', value: 'rejected' },
                        ]}
                      />
                      <FormTextareaField
                        control={form.control}
                        name="reviewer_notes"
                        label="Reviewer notes"
                        rows={4}
                        placeholder="Explain issues, required changes, or an override."
                      />
                      <Button type="submit" disabled={decide.isPending}>
                        Save decision
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Protect>
  );
}
