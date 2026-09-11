import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FileText, X } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { DropZone } from '~/components/ui/drop-zone';
import { useFileUpload } from '~/hooks/use-file-upload';
import { formatBytes } from '~/lib/utils/format';

interface FormFileFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  /** Comma-separated accept string, e.g. ".csv,.xlsx". */
  accept?: string;
  hint?: string;
  maxSizeBytes?: number;
  required?: boolean;
  disabled?: boolean;
}

/** Single-file `DropZone` bound to a form field holding a `File` (or null). */
export function FormFileField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  accept,
  hint,
  maxSizeBytes,
  required = false,
  disabled = false,
}: Readonly<FormFileFieldProps<TFieldValues>>) {
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
            <FileControl
              value={field.value as File | null | undefined}
              onChange={field.onChange}
              accept={accept}
              hint={hint}
              maxSizeBytes={maxSizeBytes}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FileControl({
  value,
  onChange,
  accept,
  hint,
  maxSizeBytes,
  disabled,
}: Readonly<{
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  hint?: string;
  maxSizeBytes?: number;
  disabled?: boolean;
}>) {
  const { addFiles, clear, error } = useFileUpload({
    accept: accept?.split(',').map((item) => item.trim()),
    maxSizeBytes,
    onFileChange: (files) => onChange(files[0]?.file ?? null),
  });

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate">{value.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatBytes(value.size)}
          </span>
          <button
            type="button"
            aria-label="Remove file"
            onClick={clear}
            disabled={disabled}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <DropZone
          onFiles={addFiles}
          accept={accept}
          multiple={false}
          disabled={disabled}
          hint={hint}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
