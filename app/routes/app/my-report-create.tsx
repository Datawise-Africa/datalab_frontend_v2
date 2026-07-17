import { useNavigate, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import type { Route } from './+types/my-report-create';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Button } from '~/components/ui/button';
import { ReportForm } from '~/components/forms/report-form';
import { useCreateMyReport } from '~/features/my-reports';
import type { ReportFormValues } from '~/lib/schema/report-schema';
import { toastUtils } from '~/lib/utils/toast';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'New Report',
    description: 'Create a new report',
  });
}

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

export default function MyReportCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateMyReport();

  const handleSubmit = (values: ReportFormValues) => {
    createMutation.mutate(values, {
      onSuccess: (created) => {
        toastUtils.success('Created report', values.title);
        navigate(`/app/my-reports/${created.id}/edit`);
      },
    });
  };

  return (
    <Protect>
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/app/my-reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to my reports
          </Link>
        </Button>

        <h1 className="mb-2 text-3xl font-bold">New Report</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Create the report first, then add versions and files to it.
        </p>

        <ReportForm
          mode="create"
          defaultValues={emptyValues}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          onCancel={() => navigate('/app/my-reports')}
        />
      </div>
    </Protect>
  );
}
