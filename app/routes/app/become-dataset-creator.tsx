import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from './+types/become-dataset-creator';
import { generateSEOTags } from '~/lib/utils/seo';
import { Form } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { FormTextField, FormTextareaField } from '~/components/form-fields';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import {
  Loader2,
  X,
  FileText,
  CheckCircle,
  Clock,
  Rocket,
  LockKeyhole,
} from 'lucide-react';
import { DropZone } from '~/components/ui/drop-zone';
import {
  becomeDatasetCreatorSchema,
  type BecomeDatasetCreatorInput,
} from '~/lib/schema/dataset-creator-schema';
import {
  useCreatorApplication,
  useSubmitCreatorApplication,
} from '~/features/dataset-creator';
import { getDatasetCreatorBadge } from '~/lib/types/dataset-creator';
import { useAppSelector } from '~/store';
import { AuthPerm } from '~/lib/utils/perm';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Become a Dataset Creator',
    description: 'Apply to become a dataset creator on Datalab Africa',
  });
}

const ACCEPTED_TYPES = [
  '.pdf',
  '.csv',
  '.xls',
  '.xlsx',
  '.doc',
  '.docx',
  '.txt',
  '.json',
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BecomeDatasetCreator() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: application, isLoading: appLoading } = useCreatorApplication();
  const submitApplication = useSubmitCreatorApplication();
  const [submitted, setSubmitted] = useState(false);

  // Access check — admins and existing creators shouldn't see this
  if (user) {
    const perm = AuthPerm.getInstance();
    if (
      perm.hasPermission('dataset_creator', user.user_role) ||
      perm.hasPermission('admin', user.user_role)
    ) {
      return (
        <div className="container mx-auto max-w-lg px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <LockKeyhole className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You already have dataset creator privileges.
          </p>
        </div>
      );
    }
  }

  if (appLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Existing application — show status
  const status = application?.status;
  if (status && status !== 'Rejected') {
    const badge = getDatasetCreatorBadge(status);
    const StatusIcon = status === 'Approved' ? CheckCircle : Clock;

    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5">
          <StatusIcon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Application Submitted</h1>
        <p className="text-muted-foreground mb-4">
          Your application to become a dataset creator is currently:
        </p>
        <Badge className={`text-sm px-3 py-1 ${badge.className}`}>
          {badge.label}
        </Badge>
        <p className="mt-6 text-sm text-muted-foreground">
          We&apos;ll notify you by email once your application has been
          reviewed.
        </p>
      </div>
    );
  }

  // Success screen after submission
  if (submitted) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Application Sent!</h1>
        <p className="text-muted-foreground">
          Thank you for applying. Our team will review your application and get
          back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Become a Dataset Creator</h1>
        <p className="text-muted-foreground">
          Apply to publish datasets on Datalab Africa. Share your data with
          thousands of researchers and developers.
        </p>
      </div>

      <ApplicationForm
        onSubmit={(data) => {
          submitApplication.mutate(data, {
            onSuccess: () => setSubmitted(true),
          });
        }}
        isPending={submitApplication.isPending}
        error={
          submitApplication.isError
            ? 'Submission failed. Please try again.'
            : undefined
        }
      />
    </div>
  );
}

function ApplicationForm({
  onSubmit,
  isPending,
  error,
}: {
  onSubmit: (data: BecomeDatasetCreatorInput) => void;
  isPending: boolean;
  error?: string;
}) {
  const form = useForm<BecomeDatasetCreatorInput>({
    resolver: zodResolver(becomeDatasetCreatorSchema),
    defaultValues: {
      affiliation: '',
      expertise: '',
      reason_for_joining: '',
      past_work_files: [],
    },
  });

  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const arr = Array.from(fileList);
      const base64Strings: string[] = [];
      const fileMeta: { name: string; size: number }[] = [];

      for (const file of arr) {
        if (file.size > 20 * 1024 * 1024) continue; // 20MB max
        const b64 = await fileToBase64(file);
        base64Strings.push(b64);
        fileMeta.push({ name: file.name, size: file.size });
      }

      const current = form.getValues('past_work_files') ?? [];
      form.setValue('past_work_files', [...current, ...base64Strings]);
      setFiles((prev) => [...prev, ...fileMeta]);
    },
    [form]
  );

  const removeFile = (index: number) => {
    const current = form.getValues('past_work_files') ?? [];
    form.setValue(
      'past_work_files',
      current.filter((_, i) => i !== index)
    );
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormTextField
          control={form.control}
          name="affiliation"
          label="Affiliation"
          placeholder="e.g. Company, University, Research Group"
          required
        />

        <FormTextField
          control={form.control}
          name="expertise"
          label="Expertise"
          placeholder="e.g. Data Science, AI, Research"
          required
        />

        <FormTextareaField
          control={form.control}
          name="reason_for_joining"
          label="Reason for Joining"
          placeholder="Brief explanation of why you want to become a dataset creator..."
          rows={4}
          required
        />

        {/* File upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Past Work Files{' '}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </p>

          <DropZone
            onFiles={(files) => processFiles(files)}
            accept={ACCEPTED_TYPES.join(',')}
            hint="PDF, CSV, Excel, Word, TXT, JSON — max 20 MB per file"
          />

          {files.length > 0 && (
            <div className="space-y-2 mt-3">
              {files.map((file, idx) => (
                <Card key={`${file.name}-${idx}`} className="py-0">
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </form>
    </Form>
  );
}
