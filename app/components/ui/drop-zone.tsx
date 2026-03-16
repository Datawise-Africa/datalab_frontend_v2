import { useRef, useState, type ReactNode } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '~/lib/utils';

interface DropZoneProps {
  /** Called with the selected/dropped files. */
  onFiles: (files: FileList) => void;
  /** Comma-separated accept string, e.g. ".pdf,.csv,.json" */
  accept?: string;
  /** Allow multiple files. Defaults to true. */
  multiple?: boolean;
  /** Whether the drop zone is disabled. */
  disabled?: boolean;
  /** Custom content inside the drop zone. Falls back to default layout. */
  children?: ReactNode;
  /** Additional class names for the outer container. */
  className?: string;
  /** Hint text below the main label. */
  hint?: string;
}

/**
 * Reusable accessible drag-and-drop file picker.
 *
 * - Supports drag & drop with visual feedback
 * - Click or keyboard (Enter / Space) opens native file picker
 * - `role="button"`, `tabIndex`, focus ring for full a11y
 *
 * @example
 * ```tsx
 * <DropZone
 *   onFiles={(files) => handleUpload(files)}
 *   accept=".pdf,.csv,.xlsx"
 *   hint="PDF, CSV, Excel — max 20 MB per file"
 * />
 * ```
 */
export function DropZone({
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  children,
  className,
  hint,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const open = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/40',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled && e.dataTransfer.files.length > 0) {
          onFiles(e.dataTransfer.files);
        }
      }}
    >
      {children ?? (
        <>
          <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop files or{' '}
            <span className="font-medium text-primary">browse</span>
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFiles(e.target.files);
          }
          e.target.value = '';
        }}
      />
    </div>
  );
}
