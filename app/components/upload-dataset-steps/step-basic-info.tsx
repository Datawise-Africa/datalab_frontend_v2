import { useFormContext } from 'react-hook-form';
import { useStepValidator } from '~/components/ui/multi-step-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '~/components/ui/form';
import { Switch } from '~/components/ui/switch';
import {
  FormTextField,
  FormTextareaField,
  FormSelectField,
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
  const { control, trigger, formState } =
    useFormContext<UploadDatasetFormValues>();

  useStepValidator(async () => {
    const fields = [
      'name',
      'description',
      'dataset_type',
      'category',
      'license',
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <FormSelectField
          control={control}
          name="dataset_type"
          label="Dataset Type"
          placeholder="Select type"
          options={DATASET_TYPES.map((t) => ({
            label: t.label,
            value: t.value,
          }))}
        />

        <FormSelectField
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

      <FormSelectField
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

      <FormSelectField
        control={control}
        name="origin_region"
        label="Origin Region (Countries)"
        placeholder="Select countries..."
        searchPlaceholder="Search countries..."
        emptyText="No countries found."
        multiple
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
    </div>
  );
}
