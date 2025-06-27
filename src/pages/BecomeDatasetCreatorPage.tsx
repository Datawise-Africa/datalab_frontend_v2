import type React from 'react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  Loader2,
  LockKeyhole,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  becomeDatasetCreatorSchema,
  type BecomeDatasetCreatorSchema,
} from '@/lib/schema/become-dataset-creator-schema';
import useDatasetCreator from '@/hooks/use-dataset-creator';
import { Base64FileManager } from '@/lib/utils/base-64-file-manager';
import { useAuth } from '@/context/AuthProvider';
import { AuthPerm } from '@/lib/auth/perm';
import { formatFileSize } from '../lib/utils/format-file-size';
import { Badge } from '@/components/ui/badge';
import type { PaginatedGetBecomeDatasetCreatorResponse } from '@/lib/types/dataset-creator';
import toast from 'react-hot-toast';
import { extractCorrectErrorMessage } from '@/lib/error';
type ApprovalStatus =
  PaginatedGetBecomeDatasetCreatorResponse['data'][number]['status'];
const getStatusBadgeClass = (status: ApprovalStatus | 'N/A' | 'Confirmed') => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
export default function BecomeDatasetCreatorPage() {
  const [requestSent, setRequestSent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const auth = useAuth();
  const authPerm = AuthPerm.getInstance();
  const { createDatasetCreator, isLoading, currentStatus, refreshData } =
    useDatasetCreator({
      shouldFetch: true,
    });

  const form = useForm<BecomeDatasetCreatorSchema>({
    resolver: zodResolver(becomeDatasetCreatorSchema),
    defaultValues: {
      affiliation: '',
      expertise: '',
      reason_for_joining: '',
      past_work_files: undefined,
    },
  });

  const onSubmit = async (data: BecomeDatasetCreatorSchema) => {
    try {
      console.log('Form submitted:', data);
      await createDatasetCreator(data);
      setRequestSent(true);
      await refreshData(); // Refresh data after submission
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        <div className="text-sm">{extractCorrectErrorMessage(error)}</div>,
      );
    }

    // Here you would typically send the data to your API
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);

      // Create a new FileList for the form
      const dt = new DataTransfer();
      selectedFiles.forEach((file) => dt.items.add(file));
      fileArray.forEach((file) => dt.items.add(file));
      const base64Files = await Base64FileManager.convertFilesToBase64(
        dt.files,
      );

      form.setValue('past_work_files', base64Files);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);

      // Create a new FileList for the form
      const dt = new DataTransfer();
      selectedFiles.forEach((file) => dt.items.add(file));
      fileArray.forEach((file) => dt.items.add(file));
      const base64Files = await Base64FileManager.convertFilesToBase64(
        dt.files,
      );

      form.setValue('past_work_files', base64Files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = async (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    const newBase64Files = await Promise.all(
      newFiles.map(
        async (file) => await Base64FileManager.convertFileToBase64(file),
      ),
    );
    // Update form value with new files
    form.setValue(
      'past_work_files',
      newBase64Files.length > 0 ? newBase64Files : undefined,
    );
  };

  const isFormLoadingOrSubmitting = useMemo(() => {
    return form.formState.isSubmitting || isLoading;
  }, [form.formState.isSubmitting, isLoading]);
  // const already;
  if (
    auth.isAuthenticated &&
    authPerm.canAnyRole(['admin', 'dataset_creator'], auth.state.userRole)
  ) {
    return (
      <div className="flex min-h-[calc(100vh_-_20rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md border-none text-center shadow-none">
          <CardContent className="border-none pt-6">
            <div className="flex flex-col items-center gap-4">
              <LockKeyhole className="h-16 w-16 text-red-800/60" />
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="max-w-sm text-gray-600">
                You are already a dataset creator.
              </p>
              {/* <Button
                onClick={() => (window.location.href = '/')}
                className="mt-4"
              >
                Go to Main Dashboard
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (currentStatus !== 'N/A') {
    return (
      <div className="flex min-h-[calc(100vh_-_20rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md border-none text-center shadow-none">
          <CardContent className="border-none pt-6">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h1 className="text-2xl font-bold">
                You already have a dataset creator request in
                <br />
                <Badge
                  variant={'default'}
                  className={cn(
                    'text-sm font-medium',
                    getStatusBadgeClass(currentStatus),
                  )}
                >
                  {currentStatus} status
                </Badge>
              </h1>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (requestSent) {
    return (
      <div className="flex min-h-[calc(100vh_-_20rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md border-none text-center shadow-none">
          <CardContent className="border-none pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl text-blue-500">🚀</div>
              <h1 className="text-2xl font-bold">Application Sent!</h1>
              <p className="max-w-sm text-gray-600">
                Your application has been received! We're reviewing your request
                and will notify you via email once approved.
              </p>
              {/* <Link
                to={'/app/dataset-creator-dashboard'}
                className="mt-4 bg-primary text-subtle px-6 py-2 rounded-md hover:bg-primary/80 transition-colors"
              >
                Go Dashboard
              </Link> */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (isLoading) {
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{'Loading'}</h3>
          <p className="mt-1 text-gray-600">
            {'Loading dataset creator application...'}
          </p>
        </div>
      </div>
    </div>;
  }
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl p-6">
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">
              Become a Dataset Creator
            </CardTitle>
          </CardHeader>
          <CardContent className="border-subtle border p-4 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Affiliation */}
                <FormField
                  control={form.control}
                  name="affiliation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Affiliation <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="i.e. Company, University, Research Group"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Expertise */}
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Expertise <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="i.e. Data Science, AI, Research"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Reason for Joining */}
                <FormField
                  control={form.control}
                  name="reason_for_joining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Reason for Joining{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief explanation of why you want to become a dataset creator"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <FormField
                  control={form.control}
                  name="past_work_files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload any of your past work</FormLabel>
                      <FormControl>
                        <FormLabel
                          htmlFor={field.name}
                          className="block space-y-4"
                        >
                          {/* Upload Area */}
                          <div
                            className={cn(
                              'rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                              isDragOver
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-gray-400',
                            )}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Upload className="h-8 w-8 text-gray-400" />
                              <div className="text-sm">
                                <label
                                  // htmlFor="file-upload"
                                  className="cursor-pointer"
                                >
                                  <span className="text-primary hover:text-primary/80 font-medium">
                                    Click to upload
                                  </span>
                                  <span className="text-gray-500">
                                    {' '}
                                    or drag and drop
                                  </span>
                                </label>
                                <input
                                  id={field.name}
                                  name={field.name}
                                  type="file"
                                  className="sr-only"
                                  multiple
                                  accept=".pdf,.csv,.xls,.xlsx,.doc,.docx,.txt,.json"
                                  onChange={handleFileChange}
                                />
                              </div>
                              <p className="text-xs text-gray-500">
                                PDF, CSV, XLS, DOC, TXT, JSON etc. (max. 20 MB
                                per file)
                              </p>
                            </div>
                          </div>

                          {/* Selected Files */}
                          {selectedFiles.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">
                                Selected Files:
                              </h4>
                              <div className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {formatFileSize(file.size)}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(index)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </FormLabel>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="text-subtle w-full disabled:cursor-not-allowed"
                  disabled={isFormLoadingOrSubmitting}
                >
                  {isFormLoadingOrSubmitting ? (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
