import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Badge } from '~/components/ui/badge';
import { FormTextField, FormTextareaField } from '~/components/form-fields';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { DropZone } from '~/components/ui/drop-zone';
import { useFileUpload } from '~/hooks/use-file-upload';
import {
  CheckCircle,
  ArrowRight,
  Loader2,
  FileText,
  X,
  Clock,
  Rocket,
} from 'lucide-react';
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
import { useAppModal } from '~/store/slices/modal-slice';

const ACCEPTED_FILE_TYPES = [
  '.pdf',
  '.csv',
  '.xls',
  '.xlsx',
  '.doc',
  '.docx',
  '.txt',
  '.json',
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CreatorApplicationForm() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const { data: application, isLoading: appLoading } = useCreatorApplication();
  const submitApplication = useSubmitCreatorApplication();
  const [submitted, setSubmitted] = useState(false);

  // Not logged in — prompt sign-in
  if (!isAuthenticated) {
    return (
      <div className="py-8 text-center space-y-4">
        <p className="text-muted-foreground">
          Sign in to submit your creator application.
        </p>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => authModal.open()}
        >
          Sign in to Apply
        </Button>
      </div>
    );
  }

  if (appLoading) {
    return (
      <div className="flex items-center justify-center py-12">
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
      <div className="py-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/5">
          <StatusIcon className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Application Submitted</h3>
        <p className="text-muted-foreground">Your application is currently:</p>
        <Badge className={`text-sm px-3 py-1 ${badge.className}`}>
          {badge.label}
        </Badge>
        <p className="text-sm text-muted-foreground">
          We&apos;ll notify you by email once reviewed.
        </p>
      </div>
    );
  }

  // Just submitted
  if (submitted) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/5">
          <Rocket className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Application Sent!</h3>
        <p className="text-muted-foreground">
          Thank you for applying. Our team will review your application and get
          back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <ApplicationFormFields
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
  );
}

function ApplicationFormFields({
  onSubmit,
  isPending,
  error,
}: Readonly<{
  onSubmit: (data: BecomeDatasetCreatorInput) => void;
  isPending: boolean;
  error?: string;
}>) {
  const form = useForm<BecomeDatasetCreatorInput>({
    resolver: zodResolver(becomeDatasetCreatorSchema),
    defaultValues: {
      affiliation: '',
      expertise: '',
      reason_for_joining: '',
      past_work_files: [],
      accept_terms: false as unknown as true,
    },
  });

  const {
    files,
    addFiles,
    removeAt,
    error: fileError,
  } = useFileUpload({
    multiple: true,
    output: 'file',
    maxFiles: 10,
    maxSizeBytes: 20 * 1024 * 1024,
    accept: ACCEPTED_FILE_TYPES,
    onFileChange: (managed) => {
      form.setValue(
        'past_work_files',
        managed.map((f) => f.data)
      );
    },
  });

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
            onFiles={addFiles}
            accept={ACCEPTED_FILE_TYPES.join(',')}
            hint="PDF, CSV, Excel, Word, TXT, JSON — max 20 MB per file"
          />

          {fileError && <p className="text-sm text-destructive">{fileError}</p>}

          {files.length > 0 && (
            <div className="space-y-2 mt-3">
              {files.map((file, idx) => (
                <div
                  key={file.key}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="ml-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terms */}
        <FormField
          control={form.control}
          name="accept_terms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    id="creator-terms"
                    checked={field.value === true}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                </FormControl>
                <Label
                  htmlFor="creator-terms"
                  className="text-sm font-normal text-muted-foreground leading-relaxed cursor-pointer"
                >
                  I agree to the{' '}
                  <Link
                    to="/terms-of-service"
                    className="text-primary underline hover:text-primary"
                  >
                    Creator Terms and Conditions
                  </Link>
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Applications are typically reviewed within 3-5 business days.
        </p>
      </form>
    </Form>
  );
}
