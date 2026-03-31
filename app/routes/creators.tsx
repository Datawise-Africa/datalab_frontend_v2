import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from './+types/creators';
import { generateSEOTags } from '~/lib/utils/seo';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { Textarea } from '~/components/ui/textarea';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { DropZone } from '~/components/ui/drop-zone';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import {
  Upload,
  DollarSign,
  Users,
  Shield,
  BarChart3,
  Globe,
  CheckCircle,
  ArrowRight,
  Code,
  Star,
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

export function meta(_: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Become a Dataset Creator',
    description:
      "Join Datalab Africa's creator program. Publish datasets, reach thousands of developers, and earn revenue.",
  });
}

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

const stats = [
  { label: 'Creators', value: '500+' },
  { label: 'Datasets', value: '10,000+' },
  { label: 'Earned', value: '$2M+' },
  { label: 'Countries', value: '150+' },
];

const steps = [
  {
    icon: Upload,
    title: '1. Prepare Your Data',
    description:
      'Clean, document, and format your dataset according to our quality standards',
  },
  {
    icon: Shield,
    title: '2. Submit for Review',
    description:
      'Our team reviews your dataset for quality, accuracy, and licensing compliance',
  },
  {
    icon: Globe,
    title: '3. Publish & Share',
    description:
      'Your dataset goes live on the marketplace, accessible via API and direct download',
  },
  {
    icon: DollarSign,
    title: '4. Earn Revenue',
    description:
      'Get paid based on downloads and API usage. Set your own pricing tier',
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: 'Monetize Your Data',
    description:
      'Earn recurring revenue every time developers access your datasets through our API',
  },
  {
    icon: Users,
    title: 'Reach Global Audience',
    description:
      'Thousands of developers and researchers discover and use datasets on Data Lab daily',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track downloads, API calls, revenue, and user engagement in real-time',
  },
  {
    icon: Shield,
    title: 'IP Protection',
    description:
      'Choose your license terms. We enforce attribution and usage requirements on your behalf',
  },
  {
    icon: Star,
    title: 'Creator Spotlight',
    description:
      'Top creators get featured on our homepage and in our newsletter to 50,000+ subscribers',
  },
  {
    icon: Code,
    title: 'API Distribution',
    description:
      'Your data is automatically served via our high-performance REST API with SDKs',
  },
];

export default function Creators() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Creator Program"
        description="Publish high-quality datasets, reach thousands of developers, and earn revenue from your data."
      >
        <Button asChild>
          <a href="#apply-form">
            Apply to Become a Creator
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Go from raw data to published dataset in four simple steps.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.title}
                  className="text-center border-none shadow-sm bg-gray-50/60"
                >
                  <CardHeader className="pb-2">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ==================== WHY BECOME A CREATOR ==================== */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Why Become a Creator
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Everything you need to publish, distribute, and monetize your
              datasets.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="border shadow-sm">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-lg">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ==================== APPLICATION FORM ==================== */}
      <section id="apply-form" className="bg-primary/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Apply to Become a Creator
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Fill out the form below and our team will review your application.
            </p>
          </div>

          <Card className="mx-auto mt-12 max-w-2xl shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <CreatorApplicationForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Integrated Application Form                                        */
/* ------------------------------------------------------------------ */

function CreatorApplicationForm() {
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
        if (file.size > 20 * 1024 * 1024) continue;
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
        <FormField
          control={form.control}
          name="affiliation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affiliation</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Company, University, Research Group"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expertise</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Data Science, AI, Research"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason_for_joining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Joining</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief explanation of why you want to become a dataset creator..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
            accept={ACCEPTED_FILE_TYPES.join(',')}
            hint="PDF, CSV, Excel, Word, TXT, JSON — max 20 MB per file"
          />

          {files.length > 0 && (
            <div className="space-y-2 mt-3">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <Checkbox id="creator-terms" required className="mt-0.5" />
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
