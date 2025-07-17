import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type Control,
  type FieldPath,
  FormProvider,
  type PathValue,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  Eye,
  EyeOff,
  X,
  Search,
  Check,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
//   CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

// Utility types for schema inference
type Primitive = string | number | boolean | Date;
type NestedObject = {
  [key: string]: Primitive | NestedObject | Primitive[] | NestedObject[];
};

// Base field configuration
interface BaseFieldConfig<
  T extends NestedObject,
  K extends FieldPath<T> = FieldPath<T>
> {
  name: K;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  defaultValue?: PathValue<T, K>;
  icon?: LucideIcon;
}

// Field type specific configurations
interface TextFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "text" | "email" | "password";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  showPasswordToggle?: boolean;
}

interface NumberFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "number";
  min?: number;
  max?: number;
}

interface TextareaFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "textarea";
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

interface SelectFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "select";
  options: Array<{ value: PathValue<T, K>; label: string }>;
  multiple?: boolean;
  searchable?: boolean;
}

interface CheckboxFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "checkbox";
}

interface RadioFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "radio";
  options: Array<{ value: PathValue<T, K>; label: string }>;
  orientation?: "horizontal" | "vertical";
}

interface DateFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "date";
  minDate?: Date;
  maxDate?: Date;
}

interface ComboboxFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "combobox";
  options: Array<{ value: PathValue<T, K>; label: string }>;
  multiple?: boolean;
  searchable?: boolean;
}

interface ChipFieldConfig<T extends NestedObject, K extends FieldPath<T>>
  extends BaseFieldConfig<T, K> {
  type: "chip";
  maxChips?: number;
  allowDuplicates?: boolean;
}

type FieldConfig<T extends NestedObject> =
  | TextFieldConfig<T, FieldPath<T>>
  | NumberFieldConfig<T, FieldPath<T>>
  | TextareaFieldConfig<T, FieldPath<T>>
  | SelectFieldConfig<T, FieldPath<T>>
  | CheckboxFieldConfig<T, FieldPath<T>>
  | RadioFieldConfig<T, FieldPath<T>>
  | DateFieldConfig<T, FieldPath<T>>
  | ComboboxFieldConfig<T, FieldPath<T>>
  | ChipFieldConfig<T, FieldPath<T>>;

// Form step configuration
interface FormStep<T extends NestedObject> {
  title?: string;
  description?: string;
  fields: FieldConfig<T>[];
}

// Render props interfaces
export interface FormHeaderProps<T extends NestedObject> {
  currentStep?: number;
  totalSteps?: number;
  stepTitle?: string;
  stepDescription?: string;
  formData: T;
  isValid: boolean;
}

export interface FormFooterProps<T extends NestedObject> {
  currentStep?: number;
  totalSteps?: number;
  formData: T;
  isValid: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

type FieldIcon = { Icon?: LucideIcon };

// Field creation functions with icon support
export function createTextField<T extends NestedObject, K extends FieldPath<T>>(
  name: K,
  config?: Omit<TextFieldConfig<T, K>, "name" | "type"> & FieldIcon
): TextFieldConfig<T, K> {
  return { name, type: "text", ...config } as TextFieldConfig<T, K>;
}

export function createEmailField<
  T extends NestedObject,
  K extends FieldPath<T>
>(
  name: K,
  config?: Omit<TextFieldConfig<T, K>, "name" | "type"> & FieldIcon
): TextFieldConfig<T, K> {
  return { name, type: "email", ...config } as TextFieldConfig<T, K>;
}

export function createPasswordField<
  T extends NestedObject,
  K extends FieldPath<T>
>(
  name: K,
  config?: Omit<TextFieldConfig<T, K>, "name" | "type"> & FieldIcon
): TextFieldConfig<T, K> {
  return {
    name,
    type: "password",
    showPasswordToggle: true,
    ...config,
  } as TextFieldConfig<T, K>;
}

export function createNumberField<
  T extends NestedObject,
  K extends FieldPath<T>
>(
  name: K,
  config?: Omit<NumberFieldConfig<T, K>, "name" | "type"> & FieldIcon
): NumberFieldConfig<T, K> {
  return { name, type: "number", ...config } as NumberFieldConfig<T, K>;
}

export function createTextareaField<
  T extends NestedObject,
  K extends FieldPath<T>
>(
  name: K,
  config?: Omit<TextareaFieldConfig<T, K>, "name" | "type">
): TextareaFieldConfig<T, K> {
  return { name, type: "textarea", ...config } as TextareaFieldConfig<T, K>;
}

export function createSelectField<
  T extends NestedObject,
  K extends FieldPath<T>
>(
  name: K,
  options: Array<{ value: PathValue<T, K>; label: string }>,
  config?: Omit<SelectFieldConfig<T, K>, "name" | "type" | "options"> &
    FieldIcon
): SelectFieldConfig<T, K> {
  return { name, type: "select", options, ...config } as SelectFieldConfig<
    T,
    K
  >;
}

export function createCheckboxField<
  T extends NestedObject,
  K extends FieldPath<T>
>(
  name: K,
  config?: Omit<CheckboxFieldConfig<T, K>, "name" | "type">
): CheckboxFieldConfig<T, K> {
  return { name, type: "checkbox", ...config } as CheckboxFieldConfig<T, K>;
}

export function createRadioField<
  T extends NestedObject,
  K extends FieldPath<T>
>(
  name: K,
  options: Array<{ value: PathValue<T, K>; label: string }>,
  config?: Omit<RadioFieldConfig<T, K>, "name" | "type" | "options">
): RadioFieldConfig<T, K> {
  return {
    name,
    type: "radio",
    options,
    orientation: "vertical",
    ...config,
  } as RadioFieldConfig<T, K>;
}

export function createDateField<T extends NestedObject, K extends FieldPath<T>>(
  name: K,
  config?: Omit<DateFieldConfig<T, K>, "name" | "type"> & FieldIcon
): DateFieldConfig<T, K> {
  return { name, type: "date", ...config } as DateFieldConfig<T, K>;
}

export function createComboboxField<
  T extends NestedObject,
  K extends FieldPath<T>
>(
  name: K,
  options: Array<{ value: PathValue<T, K>; label: string }>,
  config?: Omit<ComboboxFieldConfig<T, K>, "name" | "type" | "options"> &
    FieldIcon
): ComboboxFieldConfig<T, K> {
  return {
    name,
    type: "combobox",
    options,
    multiple: false,
    searchable: true,
    ...config,
  } as ComboboxFieldConfig<T, K>;
}

export function createChipField<T extends NestedObject, K extends FieldPath<T>>(
  name: K,
  config?: Omit<ChipFieldConfig<T, K>, "name" | "type"> & FieldIcon
): ChipFieldConfig<T, K> {
  return {
    name,
    type: "chip",
    allowDuplicates: false,
    ...config,
  } as ChipFieldConfig<T, K>;
}

export function createStep<T extends NestedObject>(
  fields: FieldConfig<T>[],
  options?: {
    title?: string;
    description?: string;
  }
): FormStep<T> {
  return {
    fields,
    title: options?.title,
    description: options?.description,
  };
}

// Schema inference
function inferSchemaFromConfig<T extends NestedObject>(
  defaultValues: T,
  fields: FieldConfig<T>[]
): z.ZodObject<any> {
  const schema: Record<string, z.ZodTypeAny> = {};

  const findConfig = (name: string) =>
    fields.find((f) => String(f.name) === name) as FieldConfig<T> | undefined;

  for (const key in defaultValues) {
    const val = defaultValues[key];
    const cfg = findConfig(key);

    let zod: z.ZodTypeAny;
    if (typeof val === "string") zod = z.string();
    else if (typeof val === "number") zod = z.number();
    else if (typeof val === "boolean") zod = z.boolean();
    else if (val instanceof Date) zod = z.date();
    else if (Array.isArray(val)) {
      // Try to infer array type from config
      if (cfg?.type === "chip") {
        zod = z.array(z.string());
      } else if (cfg?.type === "select" && (cfg as SelectFieldConfig<T, any>).multiple) {
        zod = z.array(z.string());
      } else if (cfg?.type === "combobox" && (cfg as ComboboxFieldConfig<T, any>).multiple) {
        zod = z.array(z.string());
      } else {
        zod = z.array(z.any());
      }
    }
    else zod = z.any();

    if (cfg) {
      switch (cfg.type) {
        case "email":
          zod = (zod as z.ZodString).email("Please enter a valid email");
          break;
        case "text":
        case "textarea":
        case "password": {
          const { minLength, maxLength } = cfg as
            | TextFieldConfig<T, any>
            | TextareaFieldConfig<T, any>;
          const pattern = (cfg as TextFieldConfig<T, any>).pattern || undefined;
          if (minLength) zod = (zod as z.ZodString).min(minLength);
          if (maxLength) zod = (zod as z.ZodString).max(maxLength);
          if (pattern) zod = (zod as z.ZodString).regex(pattern);
          break;
        }
        case "number": {
          const { min, max } = cfg as NumberFieldConfig<T, any>;
          if (min !== undefined) zod = (zod as z.ZodNumber).min(min);
          if (max !== undefined) zod = (zod as z.ZodNumber).max(max);
          break;
        }
        case "date": {
          const { minDate, maxDate } = cfg as DateFieldConfig<T, any>;
          if (minDate)
            zod = (zod as z.ZodDate).refine((d) => d >= minDate, {
              message: `Date must be on/after ${minDate.toDateString()}`,
            });
          if (maxDate)
            zod = (zod as z.ZodDate).refine((d) => d <= maxDate, {
              message: `Date must be on/before ${maxDate.toDateString()}`,
            });
          break;
        }
        default:
          break;
      }

      if (cfg.required) {
        if (typeof val === "string")
          zod = (zod as z.ZodString).min(1, "Required");
      } else {
        zod = zod.optional();
      }
    }

    schema[key] = zod;
  }

  return z.object(schema);
}

// Field Components
interface BaseFormFieldProps<T extends NestedObject, K extends FieldPath<T>> {
  control: Control<T>;
  name: K;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  Icon?: LucideIcon;
}

function TextFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  className,
  required,
  disabled,
  showPasswordToggle = false,
  Icon,
  description,
}: BaseFormFieldProps<T, K> & {
  type?: "text" | "email" | "password" | "number";
  showPasswordToggle?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {Icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
                <Input
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                {...(field as any)}
                className={cn(
                  "h-11 border-2 border-border bg-white px-3 py-2 text-sm ring-offset-background",
                  "placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "transition-colors duration-200",
                  Icon ? "pl-10" : "pl-3",
                  type === "password" && showPasswordToggle ? "pr-10" : "pr-3"
                )}
              />
              {type === "password" && showPasswordToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={disabled}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function TextareaFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  className,
  required,
  disabled,
  description,
}: BaseFormFieldProps<T, K> & { rows?: number }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              {...(field as any)}
              className={cn(
                "min-h-[80px] border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background",
                "placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-colors duration-200 resize-none"
              )}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function SelectFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  placeholder,
  options,
  className,
  required,
  disabled,
  multiple = false,
  searchable = false,
  Icon,
  description,
}: BaseFormFieldProps<T, K> & {
  options: Array<{ value: PathValue<T, K>; label: string }>;
  multiple?: boolean;
  searchable?: boolean;
}) {
//   const [open, setOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

  if (multiple || searchable) {
    return (
      <MultiSelectFormField
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        options={options}
        className={className}
        required={required}
        disabled={disabled}
        multiple={multiple}
        searchable={searchable}
        Icon={Icon}
        description={description}
      />
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={disabled}
          >
            <FormControl>
              <div className="relative">
                {Icon && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <SelectTrigger
                  className={cn(
                    "h-11 w-full border-2 border-border bg-white",
                    "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-colors duration-200",
                    Icon ? "pl-10" : "pl-3"
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </div>
            </FormControl>
            <SelectContent className="max-h-60 bg-white border border-border shadow-md z-50">
              {options.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function MultiSelectFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  placeholder,
  options,
  className,
  required,
  disabled,
  multiple = false,
  searchable = true,
  Icon,
  description,
}: BaseFormFieldProps<T, K> & {
  options: Array<{ value: PathValue<T, K>; label: string }>;
  multiple?: boolean;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                      "h-11 w-full justify-between border-2 border-border bg-white",
                      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "transition-colors duration-200",
                      Icon ? "pl-10" : "pl-3",
                      "pr-3"
                    )}
                  >
                    <div className="flex flex-1 flex-wrap gap-1 overflow-hidden">
                      {multiple ? (
                        Array.isArray(field.value) && field.value.length > 0 ? (
                          <>
                            {field.value.slice(0, 2).map((value) => {
                              const selectedOption = options.find(
                                (option) => option.value === value
                              );
                              return (
                                <Badge
                                  key={String(value)}
                                  variant="secondary"
                                  className="mr-1 text-xs"
                                >
                                  {selectedOption?.label}
                                </Badge>
                              );
                            })}
                            {field.value.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{field.value.length - 2} more
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            {placeholder || "Select options..."}
                          </span>
                        )
                      ) : (
                        <span className={cn(
                          field.value ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {field.value
                            ? options.find(
                                (option) => option.value === field.value
                              )?.label
                            : placeholder || "Select an option..."}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border border-border shadow-lg z-50" align="start">
                <Command>
                  {searchable && (
                    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <input
                        placeholder="Search options..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  )}
                  <CommandList>
                    <CommandEmpty>No options found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-60">
                        {filteredOptions.map((option) => (
                          <CommandItem
                            key={String(option.value)}
                            value={String(option.value)}
                            onSelect={() => {
                              if (multiple) {
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const newValue = currentValue.some(v => String(v) === String(option.value))
                                  ? currentValue.filter((v) => String(v) !== String(option.value))
                                  : [...currentValue, option.value];
                                field.onChange(newValue);
                              } else {
                                field.onChange(
                                  field.value === option.value ? null : option.value
                                );
                                setOpen(false);
                              }
                            }}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center w-full">
                              {multiple && (
                                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                                  {Array.isArray(field.value) &&
                                    field.value.some(v => String(v) === String(option.value)) && (
                                      <Check className="h-3 w-3" />
                                    )}
                                </div>
                              )}
                              <span className="flex-1">{option.label}</span>
                              {!multiple && field.value === option.value && (
                                <Check className="h-4 w-4" />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function CheckboxFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  description,
  className,
  required,
  disabled,
}: BaseFormFieldProps<T, K>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          <div className="flex items-start space-x-3">
            <FormControl>
              <Checkbox
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className="mt-1"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              {label && (
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
              )}
              {description && (
                <FormDescription className="text-xs text-muted-foreground">
                  {description}
                </FormDescription>
              )}
            </div>
          </div>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function RadioFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  options,
  className,
  required,
  disabled,
  orientation = "vertical",
  description,
}: BaseFormFieldProps<T, K> & {
  options: Array<{ value: PathValue<T, K>; label: string }>;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div
              className={cn(
                "flex gap-4",
                orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
              )}
            >
              {options.map((option) => (
                <label
                  key={String(option.value)}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    value={String(option.value)}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    disabled={disabled}
                    className="h-4 w-4 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2 border-border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-hover:text-primary transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function DateFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  placeholder,
  className,
  required,
  disabled,
  Icon,
  description,
  minDate,
  maxDate,
}: BaseFormFieldProps<T, K> & {
  minDate?: Date;
  maxDate?: Date;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={disabled}
                      className={cn(
                        "h-11 w-full justify-start text-left font-normal",
                        "border-2 border-border bg-white",
                        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-colors duration-200",
                        Icon ? "pl-10" : "pl-3",
                        "pr-10",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <span className="flex items-center">
                          {format(field.value as Date, "PPP")}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {placeholder || "Pick a date"}
                        </span>
                      )}
                    </Button>
                    
                    {Icon && (
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </PopoverTrigger>
                
                <PopoverContent 
                  className="w-auto p-0 shadow-lg border-border bg-white z-50" 
                  align="start"
                  sideOffset={4}
                >
                  <Calendar
                    mode="single"
                    selected={field.value as Date}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsOpen(false);
                    }}
                    disabled={(date) =>
                      disabled || 
                      (maxDate ? date > maxDate : date > new Date()) || 
                      (minDate ? date < minDate : date < new Date("1900-01-01"))
                    }
                    className="rounded-md border-0"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function ChipInputFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  placeholder,
  className,
  required,
  disabled,
  description,
  maxChips,
  allowDuplicates = false,
  Icon,
}: BaseFormFieldProps<T, K> & {
  maxChips?: number;
  allowDuplicates?: boolean;
}) {
  const [inputValue, setInputValue] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const chips = Array.isArray(field.value) ? (field.value as string[]) : [];

        const addChip = (chip: string) => {
          const trimmedChip = chip.trim();
          if (!trimmedChip) return;

          if (!allowDuplicates && chips.includes(trimmedChip)) return;
          if (maxChips && chips.length >= maxChips) return;

          field.onChange([...chips, trimmedChip]);
          setInputValue("");
        };

        const removeChip = (index: number) => {
          const newChips = chips.filter((_, i) => i !== index);
          field.onChange(newChips);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addChip(inputValue);
          } else if (e.key === "Backspace" && !inputValue && chips.length > 0) {
            removeChip(chips.length - 1);
          }
        };

        return (
          <FormItem className={cn("space-y-2", className)}>
            {label && (
              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className={cn(
                "min-h-[44px] w-full rounded-md border-2 border-border bg-white px-3 py-2 text-sm",
                "focus-within:border-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                "transition-colors duration-200"
              )}>
                <div className="mb-1 flex flex-wrap gap-1">
                  {chips.map((chip, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="inline-flex items-center gap-1 text-xs"
                    >
                      {chip}
                      <button
                        type="button"
                        onClick={() => removeChip(index)}
                        className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20 transition-colors"
                        disabled={disabled}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center">
                  {Icon && (
                    <div className="text-muted-foreground mr-2 flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder={chips.length === 0 ? placeholder : "Add more..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (inputValue.trim()) {
                        addChip(inputValue);
                      }
                    }}
                    disabled={disabled || (maxChips ? chips.length >= maxChips : false)}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </FormControl>
            {description && (
              <FormDescription className="text-xs text-muted-foreground">
                {description}
              </FormDescription>
            )}
            <FormMessage className="text-xs" />
          </FormItem>
        );
      }}
    />
  );
}

function ComboboxFormField<T extends NestedObject, K extends FieldPath<T>>({
  control,
  name,
  label,
  placeholder,
  options,
  className,
  required,
  disabled,
  multiple = false,
  searchable = true,
  Icon,
  description,
}: BaseFormFieldProps<T, K> & {
  options: { value: PathValue<T, K>; label: string }[];
  multiple?: boolean;
  searchable?: boolean;
}) {
  return (
    <MultiSelectFormField
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      options={options}
      className={className}
      required={required}
      disabled={disabled}
      multiple={multiple}
      searchable={searchable}
      Icon={Icon}
      description={description}
    />
  );
}

// Single Step Form Builder
interface SingleStepFormBuilderProps<T extends NestedObject> {
  fields: FieldConfig<T>[];
  onSubmit: (data: T) => void | Promise<void>;
  submitText?: string;
  className?: string;
  defaultValues: T;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  customValidationSchema?: z.ZodSchema<T>;
  renderHeader?: (props: FormHeaderProps<T>) => ReactNode;
  renderFooter?: (props: FormFooterProps<T>) => ReactNode;
}

export function SingleStepFormBuilder<T extends NestedObject>({
  fields,
  onSubmit,
  submitText = "Submit",
  className = "space-y-6",
  defaultValues,
  mode = "onSubmit",
  customValidationSchema,
  renderHeader,
  renderFooter,
}: SingleStepFormBuilderProps<T>) {
  const schema = customValidationSchema || inferSchemaFromConfig(defaultValues, fields);
  const form = useForm<T>({
    resolver: zodResolver(schema as z.ZodType<T, any, any>),
    defaultValues: defaultValues as any,
    mode,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldConfig: FieldConfig<T>) => {
    const commonProps = {
      control: form.control,
      name: fieldConfig.name,
      label: fieldConfig.label,
      placeholder: fieldConfig.placeholder,
      description: fieldConfig.description,
      className: fieldConfig.className,
      required: fieldConfig.required,
      disabled: fieldConfig.disabled,
      Icon: fieldConfig.icon,
    };

    switch (fieldConfig.type) {
      case "text":
      case "email":
      case "number":
        return (
          <TextFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            type={fieldConfig.type}
          />
        );

      case "password":
        return (
          <TextFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            type={fieldConfig.type}
            showPasswordToggle={(fieldConfig as TextFieldConfig<T, any>).showPasswordToggle}
          />
        );

      case "textarea":
        return (
          <TextareaFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            rows={(fieldConfig as TextareaFieldConfig<T, any>).rows}
          />
        );

      case "select":
        return (
          <SelectFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            options={(fieldConfig as SelectFieldConfig<T, any>).options}
            multiple={(fieldConfig as SelectFieldConfig<T, any>).multiple}
            searchable={(fieldConfig as SelectFieldConfig<T, any>).searchable}
          />
        );

      case "checkbox":
        return <CheckboxFormField key={String(fieldConfig.name)} {...commonProps} />;

      case "radio":
        return (
          <RadioFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            options={(fieldConfig as RadioFieldConfig<T, any>).options}
            orientation={(fieldConfig as RadioFieldConfig<T, any>).orientation}
          />
        );

      case "date": {
        const { minDate, maxDate } = fieldConfig as DateFieldConfig<T, any>;
        return <DateFormField key={String(fieldConfig.name)} {...commonProps} minDate={minDate} maxDate={maxDate} />;
      }

      case "chip":
        return (
          <ChipInputFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            maxChips={(fieldConfig as ChipFieldConfig<T, any>).maxChips}
            allowDuplicates={(fieldConfig as ChipFieldConfig<T, any>).allowDuplicates}
          />
        );

      case "combobox":
        return (
          <ComboboxFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            options={(fieldConfig as ComboboxFieldConfig<T, any>).options}
            multiple={(fieldConfig as ComboboxFieldConfig<T, any>).multiple}
            searchable={(fieldConfig as ComboboxFieldConfig<T, any>).searchable}
          />
        );

      default:
        return null;
    }
  };

  const formData = form.watch();
  const isValid = form.formState.isValid;

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
          {renderHeader &&
            renderHeader({
              formData,
              isValid,
              stepTitle: undefined,
              stepDescription: undefined,
            })}

          <div className="space-y-6">{fields.map(renderField)}</div>

          {renderFooter ? (
            renderFooter({
              formData,
              isValid,
              onSubmit: () => form.handleSubmit(handleSubmit)(),
              isSubmitting,
            })
          ) : (
            <Button 
              type="submit" 
              className="mt-8 h-11 px-8 font-medium" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : submitText}
            </Button>
          )}
        </form>
      </Form>
    </FormProvider>
  );
}

// Multi Step Form Builder
interface MultiStepFormBuilderProps<T extends NestedObject> {
  steps: FormStep<T>[];
  onSubmit: (data: T) => void | Promise<void>;
  submitText?: string;
  className?: string;
  defaultValues: T;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  onStepChange?: (stepIndex: number) => void;
  customValidationSchema?: z.ZodSchema<T>;
  renderHeader?: (props: FormHeaderProps<T>) => ReactNode;
  renderFooter?: (props: FormFooterProps<T>) => ReactNode;
}

export function MultiStepFormBuilder<T extends NestedObject>({
  steps,
  onSubmit,
  submitText = "Submit",
  className = "space-y-6",
  defaultValues,
  mode = "onSubmit",
  onStepChange,
  customValidationSchema,
  renderHeader,
  renderFooter,
}: MultiStepFormBuilderProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = steps.length;

  const allFields = steps.flatMap((step) => step.fields);
  const schema = customValidationSchema || inferSchemaFromConfig(defaultValues, allFields);

  const form = useForm<T>({
    resolver: zodResolver(schema as z.ZodType<T, any, any>),
    defaultValues: defaultValues as any,
    mode,
  });

  const currentFields = steps[currentStep].fields;

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields.map((f) => f.name) as FieldPath<T>[];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      const nextStep = Math.min(currentStep + 1, totalSteps - 1);
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handlePrev = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    onStepChange?.(prevStep);
  };

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldConfig: FieldConfig<T>) => {
    const commonProps = {
      control: form.control,
      name: fieldConfig.name,
      label: fieldConfig.label,
      placeholder: fieldConfig.placeholder,
      description: fieldConfig.description,
      className: fieldConfig.className,
      required: fieldConfig.required,
      disabled: fieldConfig.disabled,
      Icon: fieldConfig.icon,
    };

    switch (fieldConfig.type) {
      case "text":
      case "email":
      case "number":
        return (
          <TextFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            type={fieldConfig.type}
          />
        );

      case "password":
        return (
          <TextFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            type={fieldConfig.type}
            showPasswordToggle={(fieldConfig as TextFieldConfig<T, any>).showPasswordToggle}
          />
        );

      case "textarea":
        return (
          <TextareaFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            rows={(fieldConfig as TextareaFieldConfig<T, any>).rows}
          />
        );

      case "select":
        return (
          <SelectFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            options={(fieldConfig as SelectFieldConfig<T, any>).options}
            multiple={(fieldConfig as SelectFieldConfig<T, any>).multiple}
            searchable={(fieldConfig as SelectFieldConfig<T, any>).searchable}
          />
        );

      case "checkbox":
        return <CheckboxFormField key={String(fieldConfig.name)} {...commonProps} />;

      case "radio":
        return (
          <RadioFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            options={(fieldConfig as RadioFieldConfig<T, any>).options}
            orientation={(fieldConfig as RadioFieldConfig<T, any>).orientation}
          />
        );

      case "date": {
        const { minDate, maxDate } = fieldConfig as DateFieldConfig<T, any>;
        return <DateFormField key={String(fieldConfig.name)} {...commonProps} minDate={minDate} maxDate={maxDate} />;
      }

      case "chip":
        return (
          <ChipInputFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            maxChips={(fieldConfig as ChipFieldConfig<T, any>).maxChips}
            allowDuplicates={(fieldConfig as ChipFieldConfig<T, any>).allowDuplicates}
          />
        );

      case "combobox":
        return (
          <ComboboxFormField
            key={String(fieldConfig.name)}
            {...commonProps}
            options={(fieldConfig as ComboboxFieldConfig<T, any>).options}
            multiple={(fieldConfig as ComboboxFieldConfig<T, any>).multiple}
            searchable={(fieldConfig as ComboboxFieldConfig<T, any>).searchable}
          />
        );

      default:
        return null;
    }
  };

  const formData = form.watch();
  const isValid = form.formState.isValid;

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
          {renderHeader &&
            renderHeader({
              currentStep,
              totalSteps,
              stepTitle: steps[currentStep].title,
              stepDescription: steps[currentStep].description,
              formData,
              isValid,
            })}

          {!renderHeader && steps[currentStep].title && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground">
                {steps[currentStep].title}
              </h3>
              {steps[currentStep].description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {steps[currentStep].description}
                </p>
              )}
            </div>
          )}

          <div className="space-y-6">{currentFields.map(renderField)}</div>

          {renderFooter ? (
            renderFooter({
              currentStep,
              totalSteps,
              formData,
              isValid,
              onNext: handleNext,
              onPrev: handlePrev,
              onSubmit: () => form.handleSubmit(handleSubmit)(),
              isSubmitting,
            })
          ) : (
            <div className="mt-8 flex items-center justify-between">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="h-11 px-6 font-medium"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-11 px-6 font-medium"
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="h-11 px-8 font-medium" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : submitText}
                </Button>
              )}
            </div>
          )}

          {!renderFooter && (
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
          )}
        </form>
      </Form>
    </FormProvider>
  );
}

export const FormBuilder = Object.freeze({
  SingleStepFormBuilder,
  MultiStepFormBuilder,
  createTextField,
  createEmailField,
  createPasswordField,
  createNumberField,
  createTextareaField,
  createSelectField,
  createCheckboxField,
  createRadioField,
  createDateField,
  createComboboxField,
  createChipField,
  createStep,
  inferSchemaFromConfig,
  TextFormField,
  TextareaFormField,
  SelectFormField,
  CheckboxFormField,
  RadioFormField,
  DateFormField,
  ChipInputFormField,
  ComboboxFormField,
});
