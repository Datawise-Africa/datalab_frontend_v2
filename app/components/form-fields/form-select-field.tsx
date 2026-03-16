import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { AsyncSelect, type SelectOption } from '~/components/ui/async-select';

interface FormSelectFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loadingText?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  onSearch?: (query: string) => Promise<SelectOption[]>;
  debounceMs?: number;
  minSearchLength?: number;
  onValueChange?: (value: string) => void;
}

export function FormSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select an option',
  searchPlaceholder,
  emptyText,
  loadingText,
  required = false,
  disabled = false,
  options,
  onSearch,
  debounceMs,
  minSearchLength,
  onValueChange,
}: FormSelectFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <AsyncSelect
              value={field.value as string | null}
              onChange={(val) => {
                field.onChange(val);
                onValueChange?.(val ?? '');
              }}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyText={emptyText}
              loadingText={loadingText}
              disabled={disabled}
              options={options}
              onSearch={onSearch}
              debounceMs={debounceMs}
              minSearchLength={minSearchLength}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
