import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { AsyncSelect, type SelectOption } from '~/components/ui/async-select';

type ValueAs = 'string' | 'number' | 'boolean';

interface FormSelectFieldBaseProps<TFieldValues extends FieldValues> {
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
  /** Coerce each selected string value before setting on the form field. */
  valueAs?: ValueAs;
  /** Maximum selections when `multiple` is true. */
  maxSelections?: number;
  onValueChange?: (value: string | string[]) => void;
}

interface SingleSelectProps<
  TFieldValues extends FieldValues,
> extends FormSelectFieldBaseProps<TFieldValues> {
  multiple?: false;
}

interface MultiSelectProps<
  TFieldValues extends FieldValues,
> extends FormSelectFieldBaseProps<TFieldValues> {
  multiple: true;
}

type FormSelectFieldProps<TFieldValues extends FieldValues> =
  | SingleSelectProps<TFieldValues>
  | MultiSelectProps<TFieldValues>;

function coerceOne(val: unknown, as: ValueAs): unknown {
  if (typeof val === 'object' && val !== null) return val; // Shouldn't happen, but guard just in case
  if (val == null) {
    if (as === 'number') return 0;
    if (as === 'boolean') return false;
    return null;
  }
  if (as === 'number') return Number(val);
  if (as === 'boolean') return val === 'true';
  return val;
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
  valueAs = 'string',
  onValueChange,
  ...rest
}: Readonly<FormSelectFieldProps<TFieldValues>>) {
  const multiple = 'multiple' in rest && rest.multiple === true;
  const maxSelections =
    'maxSelections' in rest ? rest.maxSelections : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert stored value(s) back to string(s) for AsyncSelect display
        let displayValue: string | string[] | null;
        if (multiple) {
          displayValue = ((field.value as unknown[]) ?? []).map(String);
        } else {
          displayValue = field.value ? String(field.value) : null;
        }

        return (
          <FormItem className="self-start">
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              {multiple ? (
                <AsyncSelect
                  multiple
                  value={displayValue as string[]}
                  onChange={(vals) => {
                    const coerced = (vals as string[]).map((v) =>
                      coerceOne(v, valueAs)
                    );
                    field.onChange(coerced);
                    onValueChange?.(vals as string[]);
                  }}
                  maxSelections={maxSelections}
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
              ) : (
                <AsyncSelect
                  value={displayValue as string | null}
                  onChange={(val) => {
                    const coercedVal = coerceOne(val, valueAs);
                    field.onChange(coercedVal);
                    onValueChange?.(val as string);
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
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
