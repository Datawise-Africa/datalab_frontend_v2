import { useNavigate, useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ReportForm } from '~/components/forms/report-form';
import { useCreateMyReport } from '~/features/my-reports';
import type { ReportFormValues } from '~/lib/schema/report-schema';
import { toastUtils } from '~/lib/utils/toast';

const emptyValues: ReportFormValues = {
  title: '',
  description: '',
  abstract: '',
  report_type: 'research_paper',
  category: null,
  is_private: false,
  is_premium: false,
  tags: [],
  access_type: 'public',
};

export default function WorkspaceReportCreate() {
  const { id } = useParams<{ id: string }>();
  const workspaceId = id ?? '';
  const navigate = useNavigate();
  const createMutation = useCreateMyReport();

  const handleSubmit = (values: ReportFormValues) => {
    createMutation.mutate(
      { ...values, workspace: workspaceId },
      {
        onSuccess: (created) => {
          toastUtils.success('Created report', values.title);
          navigate(`/app/workspaces/${workspaceId}/reports/${created.id}/edit`);
        },
      }
    );
  };

  return (
    <div className="max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link to={`/app/workspaces/${workspaceId}/reports`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to workspace reports
        </Link>
      </Button>

      <h1 className="mb-2 text-2xl font-bold">New Report</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        This report will be scoped to the current workspace.
      </p>

      <ReportForm
        mode="create"
        defaultValues={emptyValues}
        lockedWorkspaceId={workspaceId}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate(`/app/workspaces/${workspaceId}/reports`)}
      />
    </div>
  );
}
