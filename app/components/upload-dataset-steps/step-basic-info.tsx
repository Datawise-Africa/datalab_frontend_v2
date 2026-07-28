import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStepValidator } from '~/components/ui/multi-step-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '~/components/ui/form';
import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { DropZone } from '~/components/ui/drop-zone';
import { useFileUpload } from '~/hooks/use-file-upload';
import {
  FormTextField,
  FormTextareaField,
  FormPickerField,
  FormNumberField,
} from '~/components/form-fields';
import type { UploadDatasetFormValues } from './types';
import { DATASET_TYPES } from './types';

type StepBasicInfoProps = {
  categories?: ReadonlyArray<{ id: string; name: string }>;
  licenses?: ReadonlyArray<{ id: string; name: string }>;
  countries?: ReadonlyArray<{ name: string }>;
};

export function StepBasicInfo({
  categories,
  licenses,
  countries,
}: Readonly<StepBasicInfoProps>) {
  const { control, trigger, formState, watch, setValue } =
    useFormContext<UploadDatasetFormValues>();

  const datasetImage = watch('dataset_image');
  const {
    addFiles,
    files,
    error: imageError,
  } = useFileUpload({
    multiple: false,
    output: 'base64',
    preview: true,
    maxSizeBytes: 2 * 1024 * 1024,
    accept: ['image/*'],
  });

  const newBase64 = files[0]?.data as string | undefined;
  useEffect(() => {
    if (newBase64) {
      setValue('dataset_image', newBase64, { shouldDirty: true });
    }
  }, [newBase64, setValue]);

  // Reset price to null whenever premium is turned off so the payload is clean.
  const isPremium = watch('is_premium');
  useEffect(() => {
    if (!isPremium) {
      setValue('price', null, { shouldValidate: true, shouldDirty: true });
    }
  }, [isPremium, setValue]);

  useStepValidator(async () => {
    const fields = [
      'name',
      'description',
      'dataset_type',
      'category',
      'license',
      'price',
    ] as const;
    const valid = await trigger([...fields]);
    if (valid) return { valid: true };

    const errors: Record<string, string> = {};
    for (const key of fields) {
      const err = formState.errors[key];
      if (err?.message) errors[key] = String(err.message);
    }
    return { valid: false, errors };
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Basic Information</h2>

      <FormTextField
        control={control}
        name="name"
        label="Name"
        placeholder="Enter a descriptive name"
        required
      />

      <FormTextareaField
        control={control}
        name="description"
        label="Description"
        placeholder="Describe your dataset..."
        rows={4}
        required
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Cover image</Label>
        {datasetImage ? (
          <div className="relative inline-flex items-start gap-3 rounded-md border p-3">
            <img
              src={datasetImage}
              alt="Dataset cover preview"
              className="h-24 w-40 rounded-md object-cover"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setValue('dataset_image', null, { shouldDirty: true })
              }
              className="text-destructive hover:text-destructive"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        ) : (
          <DropZone
            onFiles={addFiles}
            accept="image/*"
            hint="PNG, JPG, or WebP — max 2 MB"
          />
        )}
        {imageError && <p className="text-xs text-destructive">{imageError}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <FormPickerField
          control={control}
          name="dataset_type"
          label="Dataset Type"
          placeholder="Select type"
          options={DATASET_TYPES.map((t) => ({
            label: t.label,
            value: t.value,
          }))}
        />

        <FormPickerField
          control={control}
          name="category"
          label="Category"
          placeholder="Select category"
          required
          valueAs="string"
          options={
            categories?.map((c) => ({
              label: c.name,
              value: c.id,
            })) ?? []
          }
        />
      </div>

      <FormPickerField
        control={control}
        name="license"
        label="License"
        placeholder="Select license"
        required
        valueAs="string"
        options={
          licenses?.map((l) => ({
            label: l.name,
            value: l.id,
          })) ?? []
        }
      />

      <FormPickerField
        control={control}
        name="origin_region"
        label="Origin Region (Countries)"
        placeholder="Select countries..."
        searchPlaceholder="Search countries..."
        emptyMessage="No countries found."
        multi
        options={
          countries?.map((c) => ({
            label: c.name,
            value: c.name,
          })) ?? []
        }
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="is_premium"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel className="font-normal cursor-pointer">
                Premium dataset
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="is_private"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel className="font-normal cursor-pointer">
                Private
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {isPremium && (
        <FormNumberField
          control={control}
          name="price"
          label="Price (KSh)"
          placeholder="e.g. 1500"
          required
          min={0}
          step={1}
        />
      )}
    </div>
  );
}
