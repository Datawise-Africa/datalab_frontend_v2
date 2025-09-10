import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from '../ui/form';
import { useForm, type UseFormReturn } from 'react-hook-form';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Users,
  Award,
  Search,
  CheckCircle,
  Loader,
  UploadCloud,
  Plus,
  SaveIcon,
  AlertTriangle,
} from 'lucide-react';
import DatasetUploadFormStep1 from './dataset-upload-form-step1.tsx';
import DatasetUploadFormStep2 from './dataset-upload-form-step2.tsx';
import DatasetUploadFormStep3 from './dataset-upload-form-step3.tsx';
import DatasetUploadFormStep4 from './dataset-upload-form-step4.tsx';
import DatasetUploadFormStep5 from './dataset-upload-form-step5.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  uploadDatasetSchema,
  type UploadDatasetSchemaType,
} from '@/lib/schema/upload-dataset-schema';
import { extractCorrectErrorMessage } from '@/lib/error.ts';
import { useDatasetMutations } from '@/hooks/use-dataset-creator-datasets.tsx';
import type { IDataset } from '@/lib/types/data-set.ts';
import { useAuthors } from '@/hooks/use-authors.tsx';
import { useLicences } from '@/hooks/use-licences.tsx';
import { useDatasetCategories } from '@/hooks/use-dataset-categories.tsx';
import { toast } from 'sonner';

const _steps = [
  {
    id: 1,
    title: 'Basic info',
    icon: CheckCircle,
    header: {
      title: 'Basic Information',
      description: 'Provide essential information about your dataset.',
    },
  },
  {
    id: 2,
    title: 'Files',
    icon: Upload,
    header: {
      title: 'Upload Files',
      description: 'Upload the files, metadata, and datasheets.',
    },
  },
  {
    id: 3,
    title: 'Attribution',
    icon: Users,
    header: {
      title: 'Attribution & Citation',
      description:
        'Add authors and choose an appropriate license for your dataset.',
    },
  },
  {
    id: 4,
    title: 'Discovery',
    icon: Search,
    header: {
      title: 'Discovery Information',
      description: 'Make your dataset discoverable with key words and regions.',
    },
  },
  {
    id: 5,
    title: 'Terms',
    icon: Award,
    header: {
      title: 'Review & Finalize',
      description: 'Review your information and agree to platform terms.',
    },
  },
];

type DatasetUploadFormProps = {
  handleToggleFormModal: React.Dispatch<React.SetStateAction<boolean>>;
  isFormModalOpen: boolean;
  dataset?: IDataset;
};

export default function DatasetUploadForm({
  handleToggleFormModal,
  isFormModalOpen,
  dataset,
}: DatasetUploadFormProps) {
  const [step, setStep] = useState(1);
  // const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dbAuthors = useAuthors();
  const licences = useLicences();
  const categories = useDatasetCategories();
  const formDefaults = useMemo(() => {
    return {
      step_1: {
        dataset_id: undefined,
        category: undefined,
        title: '',
        description: '',
        is_premium: false,
        price: 0,
        is_private: false,
      },
      step_2: { data_files: [], metadata_files: [], datasheet_files: [] },
      step_3: {
        new_authors: [],
        license: undefined,
        authors: [],
        doi_citation: '',
      },
      step_4: {
        audience_data: {
          students: false,
          non_profit: false,
          company: false,
          public: false,
        },
        covered_regions: [],
        keywords: [],
        tags: [],
        origin_region: '',
      },
      step_5: {
        accepted_terms: {
          data_accuracy: false,
          responsible_use: false,
          privacy_compliance: false,
          rights_ownership: false,
        },
      },
    } as unknown as UploadDatasetSchemaType;
  }, []);
  // const api = useApi().privateApi;
  const mut = useDatasetMutations();
  const form = useForm({
    resolver: zodResolver(uploadDatasetSchema),
    defaultValues: formDefaults,
    mode: 'onChange',
  });

  type FormType = UseFormReturn<UploadDatasetSchemaType>;
  const currentStep = _steps.find((s) => s.id === step);
  type Step = keyof UploadDatasetSchemaType;
  const nextStep = useCallback(async () => {
    let isValid = false;
    // if (step < _steps.length) setStep(step + 1);
    if (currentStep) {
      isValid = await form.trigger(`step_${step}` as Step);
    }
    if (isValid && step < _steps.length) {
      setError(null);
      setStep(step + 1);
    }
  }, [step]);

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveDraft = form.handleSubmit(async (data) => {
    try {
      // Validate the current step before saving
      const isValid = form.trigger(`step_${step}` as Step);
      if (!isValid) {
        setError('Please fill out all required fields before saving.');
        return;
      }
      await mut.saveDraft.mutateAsync(data, {
        onSuccess: () => {
          toast.success('Draft saved successfully!', {
            description: 'Your dataset draft has been saved.',
          });
          handleToggleFormModal?.(false);
          setStep(1);
          form.reset();
          setError(null);
        },
      });
    } catch (error) {
      setError(extractCorrectErrorMessage(error));
      toast.error(extractCorrectErrorMessage(error, 'Something went wrong'), {
        description: 'Please try again later.',
      });
    }
  });
  const handleUpdateDraft = form.handleSubmit(async (data) => {
    try {
      // Validate the current step before saving
      const isValid = form.trigger(`step_${step}` as Step);
      if (!isValid) {
        setError('Please fill out all required fields before saving.');
        return;
      }
      await mut.updateDataset.mutateAsync([dataset?.id!, data], {
        onSuccess: () => {
          toast.success('Draft updated successfully!', {
            description: 'Your dataset draft has been updated.',
          });
          handleToggleFormModal?.(false);
          setStep(1);
          form.reset();
          setError(null);
        },
      });
    } catch (error) {
      setError(extractCorrectErrorMessage(error));
      toast.error(extractCorrectErrorMessage(error, 'Something went wrong'), {
        description: 'Please try again later.',
      });
    }
  });

  const isFormLoading =
    isLoading ||
    form.formState.isSubmitting ||
    mut.isArchiving ||
    mut.isCreating ||
    mut.isUpdating ||
    mut.isSavingDraft;

  const resetFormWithDefaults = useCallback(() => {
    if (dataset && isFormModalOpen) {
      form.reset({
        step_1: {
          category: ('' + dataset.category?.id) as unknown as number,
          title: dataset.title,
          description: dataset.description,
          is_premium: dataset.is_premium,
          price: dataset.price || 0,
          is_private: dataset.is_private,
          dataset_id: dataset.id,
        },
        step_2: {
          data_files: [],
          metadata_files: [],
          datasheet_files: [],
        },
        step_3: {
          new_authors: [],
          license: dataset.license?.id! ?? null,
          authors: (dataset.authors.map((au) => '' + au.id) ||
            []) as unknown as number[],
          doi_citation: dataset.doi_citation || '',
          added_authors: [],
          removed_authors: [],
        },
        step_4: {
          audience_data: {
            students: dataset.intended_audience?.students || false,
            non_profit: dataset.intended_audience?.non_profit || false,
            company: dataset.intended_audience?.company || false,
            public: dataset.intended_audience?.public || false,
          },
          covered_regions:
            dataset.covered_regions
              .split(',')
              .map((reg) => reg.trim())
              .filter(Boolean) || [],
          keywords:
            dataset.keywords
              .split(',')
              .map((kw) => kw.trim())
              .filter(Boolean) || [],
          tags: dataset.tags.map((tag) => tag.trim()).filter(Boolean) || [],
          origin_region: dataset.origin_region?.name || '',
        },
        step_5: {
          accepted_terms: {
            data_accuracy: dataset.accepted_terms?.data_accuracy || false,
            responsible_use: dataset.accepted_terms?.responsible_use || false,
            privacy_compliance:
              dataset.accepted_terms?.privacy_compliance || false,
            rights_ownership: dataset.accepted_terms?.rights_ownership || false,
          },
        },
      });
      console.log('Form reset with dataset defaults:', form.getValues());
    }
  }, [dataset, form]);
  useEffect(() => {
    if (isFormModalOpen) {
      resetFormWithDefaults();
      setStep(1);
      setError(null);
    } else {
      form.reset(formDefaults);
      setStep(1);
      setError(null);
    }
  }, [isFormModalOpen, resetFormWithDefaults, isFormModalOpen]);
  const isLastStep = step === _steps.length;

  const formType = useMemo(() => {
    const isUpdate =
      form.watch('step_1.dataset_id') !== undefined &&
      form.watch('step_1.dataset_id') !== '';
    return isUpdate ? 'update' : 'create';
  }, [form.watch('step_1.dataset_id')]);

  const createNewDataset = form.handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // const response =
      await mut.createDataset.mutateAsync(data, {
        onSuccess: () => {
          toast.success('Dataset created successfully!', {
            description: 'Your dataset is now live.',
          });
          handleToggleFormModal?.(false);
          setStep(1);
          form.reset();
        },
        onError: (error) => {
          setError(extractCorrectErrorMessage(error));
          toast.error(
            extractCorrectErrorMessage(error, 'Failed to create dataset'),
          );
          setIsLoading(false);
        },
      });
    } catch (error) {
      setError(extractCorrectErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  });

  const publishDataset = form.handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await mut.updateDataset.mutateAsync([data.step_1.dataset_id!, data], {
        onError: (error) => {
          setError(extractCorrectErrorMessage(error));
          toast.error(
            `Failed to publish dataset: ${error.message || 'Unknown error'}`,
          );
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success('Dataset published successfully!', {
            description: 'Your dataset is now live.',
          });
          handleToggleFormModal?.(false);
          setStep(1);
          form.reset();
        },
      });
    } catch (error) {
      setError(extractCorrectErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  });
  const watchedAuthors = (form.watch('step_3.authors') ?? []).map(
    (author) => '' + author,
  );

  const watchAuthorsChange = useCallback(() => {
    if (formType !== 'update' || !dataset) return;
    /**
     * When updating authors, we need to ensure that:
     * 1. For newly added authors already existing in the DB, we can either remove or add new ones.
     * 2. For removal the authors are in the dataset but not in the form authors.
     * 3. For new ones they are in the form but not in the dataset.
     */

    const oldAuthors = (dataset.authors.map((au) => au.id) || []).map(
      (author) => '' + author,
    );

    const newlyAddedAuthors = watchedAuthors.filter(
      (author) => !oldAuthors.includes('' + author),
    );
    const removedAuthors = oldAuthors.filter(
      (author) => !watchedAuthors.includes('' + author),
    );
    if (newlyAddedAuthors.length > 0) {
      form.setValue(
        'step_3.added_authors',
        newlyAddedAuthors as unknown as number[],
      );
    } else {
      form.setValue('step_3.added_authors', []);
    }

    if (removedAuthors.length > 0) {
      form.setValue(
        'step_3.removed_authors',
        removedAuthors as unknown as number[],
      );
    } else {
      form.setValue('step_3.removed_authors', []);
    }
  }, [watchedAuthors, formType, dataset, form]);
  useEffect(() => {
    watchAuthorsChange();
  }, [watchAuthorsChange]);

  return (
    <Dialog open={isFormModalOpen} onOpenChange={handleToggleFormModal}>
      <Form {...form}>
        <form className="w-full text-sm" onSubmit={createNewDataset}>
          <DialogTrigger asChild>
            <Button
              type={'button'}
              className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-h-[95vh] min-h-[85vh] w-[95vw] !max-w-[40rem] flex-col overflow-hidden rounded border-0 bg-white p-4 shadow-2xl backdrop-blur-lg">
            {/* Progress Bar */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r transition-all duration-500 ease-out"
                style={{
                  width: `${(step / _steps.length) * 100}%`,
                }}
              />
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center pt-8 pb-4">
              <div className="flex items-center space-x-4">
                {_steps.map((s, index) => {
                  const Icon = s.icon;
                  const isActive = s.id === step;
                  const isCompleted = s.id < step;

                  return (
                    <div key={s.id} className="flex items-center">
                      <div
                        className={`border-primary/30 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 md:h-8 md:w-8 ${
                          isActive
                            ? 'scale-110 bg-gradient-to-r shadow-lg'
                            : isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                        } `}
                      >
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      {index < _steps.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 w-6 transition-all duration-300 md:w-12 ${s.id < step ? 'bg-green-500' : 'bg-gray-200'} `}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogHeader className="flex flex-row items-center justify-between px-4">
              <div className="flex flex-col text-left">
                <DialogTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-sm font-bold text-transparent">
                  {currentStep?.header.title}
                </DialogTitle>
                <DialogDescription
                  asChild
                  className="text-sm leading-relaxed text-gray-600"
                >
                  <p>{currentStep?.header.description}</p>
                </DialogDescription>
              </div>
              <div>
                {!isLastStep && formType === 'create' && (
                  <Button
                    type="button"
                    variant={'outline'}
                    onClick={handleSaveDraft}
                    disabled={isFormLoading}
                    className="border-primary/300 text-primary text-sm"
                  >
                    {isFormLoading ? (
                      <Loader className="h-3 animate-spin" />
                    ) : (
                      <SaveIcon className="h-3" />
                    )}{' '}
                    <span>Save Draft</span>
                  </Button>
                )}
                {!isLastStep && formType === 'update' && (
                  <Button
                    type="button"
                    variant={'outline'}
                    onClick={handleUpdateDraft}
                    disabled={isFormLoading}
                    className="border-primary/300 text-primary text-sm"
                  >
                    {isFormLoading ? (
                      <Loader className="h-3 animate-spin" />
                    ) : (
                      <SaveIcon className="h-3" />
                    )}{' '}
                    <span>Update</span>
                  </Button>
                )}
              </div>
            </DialogHeader>
            {error && (
              <div className="flex items-center rounded bg-red-50 p-1 px-4 text-sm text-red-500">
                <AlertTriangle className="mr-1 inline h-4 w-4" />
                <strong> {error}</strong>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto w-full max-w-4xl">
                {step === 1 && (
                  <DatasetUploadFormStep1
                    form={form as FormType}
                    categories={categories.data!}
                  />
                )}
                {step === 2 && (
                  <DatasetUploadFormStep2
                    form={form as FormType}
                    files={
                      formType === 'update' && dataset
                        ? {
                            data_files: dataset.data_files,
                            metadata_files: dataset.metadata_files,
                            datasheet_files: dataset.datasheet_files,
                          }
                        : {
                            data_files: [],
                            metadata_files: [],
                            datasheet_files: [],
                          }
                    }
                  />
                )}
                {step === 3 && (
                  <DatasetUploadFormStep3
                    form={form as FormType}
                    existingAuthors={dbAuthors.data!}
                    existingLicences={licences.data!}
                  />
                )}
                {step === 4 && (
                  <DatasetUploadFormStep4 form={form as FormType} />
                )}
                {step === 5 && (
                  <DatasetUploadFormStep5 form={form as FormType} />
                )}
              </div>
            </div>

            <DialogFooter className="bg-white">
              <div className="flex w-full items-center justify-between space-x-4 p-4">
                {/* Left Section - Navigation Buttons */}
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    type="button"
                    size="sm"
                    className="border border-red-400 text-red-700 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <div className="flex items-center space-x-2">
                  {step > 1 && (
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      type="button"
                      size="sm"
                      className="border-primary/30 border"
                    >
                      <ChevronLeft className="mr- h-5 w-5" />
                      Previous
                    </Button>
                  )}
                  {!isLastStep ? (
                    <Button
                      onClick={nextStep}
                      disabled={isFormLoading}
                      variant="default"
                      type="button"
                      size="sm"
                      className="rounded px-4 text-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                      Next
                    </Button>
                  ) : (
                    <>
                      {formType === 'update' ? (
                        <Button
                          onClick={publishDataset}
                          disabled={isFormLoading}
                          variant="default"
                          type="button"
                          size="sm"
                          className="rounded px-4 text-white"
                        >
                          {isFormLoading ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <UploadCloud className="h-5 w-5" />
                          )}
                          Publish
                        </Button>
                      ) : (
                        <Button
                          onClick={createNewDataset}
                          disabled={isFormLoading}
                          variant="default"
                          type="button"
                          size="sm"
                          className="rounded px-4 text-white"
                        >
                          {isFormLoading ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <UploadCloud className="h-5 w-5" />
                          )}
                          Submit
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
