import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Checkbox } from '~/components/ui/checkbox';

interface FormCheckboxFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  /** Accepts nodes so labels can embed links (e.g. terms & conditions). */
  label: ReactNode;
  /** Optional helper text rendered under the label. */
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormCheckboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  required = false,
  disabled = false,
}: Readonly<FormCheckboxFieldProps<TFieldValues>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start gap-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value === true}
              onCheckedChange={(checked) => field.onChange(Boolean(checked))}
              onBlur={field.onBlur}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-normal leading-relaxed cursor-pointer">
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
