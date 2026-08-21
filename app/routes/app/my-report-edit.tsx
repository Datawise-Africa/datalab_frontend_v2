import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { Route } from './+types/my-report-edit';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { ReportForm } from '~/components/forms/report-form';
import { ReportVersions } from '~/components/reports/report-versions';
import {
  useMyReport,
  useUpdateMyReport,
  useUpdateMyReportStatus,
} from '~/features/my-reports';
import type { ReportFormValues } from '~/lib/schema/report-schema';
import type { Report, ReportStatus } from '~/lib/types/report';
import { toastUtils } from '~/lib/utils/toast';
import { ValidationStatusPanel } from '~/components/validation/validation-status-panel';
import { isInternalWorkspace } from '~/lib/types/common';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Edit Report',
    description: 'Edit your report',
  });
}

const statusLabels: Record<ReportStatus, string> = {
  DF: 'Draft',
  PB: 'Published',
  AR: 'Archived',
};

/** Read shape -> form shape. `category` and `access` collapse to scalars on write. */
function toFormValues(report: Report): ReportFormValues {
  return {
    title: report.title,
    description: report.description ?? '',
    abstract: report.abstract ?? '',
    report_type: report.report_type,
    category: report.category?.id ?? null,
    is_private: report.is_private,
    is_premium: report.is_premium,
    price: report.price ?? undefined,
    tags: report.tags ?? [],
    access_type: report.access?.[0]?.access_type ?? 'public',
  };
}

export default function MyReportEdit() {
  const { id } = useParams();
  const reportId = id ?? '';
  const navigate = useNavigate();

  const { data: report, isLoading, isError } = useMyReport(reportId);
  const updateMutation = useUpdateMyReport();
  const statusMutation = useUpdateMyReportStatus();

  const handleSubmit = (values: ReportFormValues) => {
    updateMutation.mutate(
      { id: reportId, input: values },
      { onSuccess: () => toastUtils.success('Saved report', values.title) }
    );
  };

  const changeStatus = (status: ReportStatus) => {
    statusMutation.mutate(
      { id: reportId, input: { status } },
      {
        onSuccess: () =>
          toastUtils.success('Status updated', statusLabels[status]),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">Report not found</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/app/my-reports">Back to my reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <Protect>
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/app/my-reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to my reports
          </Link>
        </Button>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Edit Report</h1>
              <Badge variant={report.status === 'PB' ? 'default' : 'secondary'}>
                {statusLabels[report.status]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{report.title}</p>
          </div>

          <div className="flex gap-2">
            {report.status !== 'PB' && (
              <Button
                variant="outline"
                onClick={() => changeStatus('PB')}
                disabled={statusMutation.isPending}
              >
                {statusMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isInternalWorkspace(report.workspace)
                  ? 'Publish'
                  : 'Submit for review'}
              </Button>
            )}
            {report.status === 'PB' && (
              <Button
                variant="outline"
                onClick={() => changeStatus('DF')}
                disabled={statusMutation.isPending}
              >
                Unpublish
              </Button>
            )}
          </div>
        </div>

        {report.status === 'PB' && (
          <div className="mb-8">
            <ValidationStatusPanel
              verificationStatus={report.verification_status}
              validation={report.validation}
              validationRequired={!isInternalWorkspace(report.workspace)}
            />
          </div>
        )}

        <ReportForm
          mode="edit"
          defaultValues={toFormValues(report)}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          onCancel={() => navigate('/app/my-reports')}
        />

        <Separator className="my-10" />

        <ReportVersions reportId={reportId} />
      </div>
    </Protect>
  );
}
