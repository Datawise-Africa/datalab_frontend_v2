import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

/**
 * Widths are set for every breakpoint because the base `DialogContent` caps
 * width per breakpoint (`sm:`/`lg:`/`xl:`), which a plain `max-w-*` loses to.
 */
const sizes = {
  sm: 'sm:max-w-md lg:max-w-md xl:max-w-md',
  md: 'sm:max-w-lg lg:max-w-xl xl:max-w-xl',
  lg: 'sm:max-w-2xl lg:max-w-3xl xl:max-w-3xl',
  xl: 'sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl',
} as const;

/**
 * How an overlay may be closed:
 * - `auto` — Esc, outside click or ✕ (default)
 * - `explicit` — only ✕ or your own buttons; Esc / outside clicks are ignored,
 *   so forms and important info can't be lost by a stray click
 * - `none` — no ✕ either; only your footer actions close it
 */
export type CloseMode = 'auto' | 'explicit' | 'none';

/** Radix handlers that swallow Esc / outside interaction for guarded modes. */
export function closeGuards(mode: CloseMode) {
  if (mode === 'auto') return {};
  const block = (event: Event) => event.preventDefault();
  return {
    onEscapeKeyDown: block,
    onPointerDownOutside: block,
    onInteractOutside: block,
  };
}

type AppDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `false` lets pointer events reach third-party overlays (e.g. a payment iframe). */
  modal?: boolean;
  /** Element that opens the dialog (rendered with `asChild`). */
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  /** Keep the title for screen readers only. */
  hideHeader?: boolean;
  footer?: ReactNode;
  size?: keyof typeof sizes;
  closeMode?: CloseMode;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
};

/**
 * One-import dialog: header, scrolling body and footer wired up. Use the
 * primitives in `./dialog` only for layouts this can't express.
 *
 * @example
 * <AppDialog open={open} onOpenChange={setOpen} title="Rename" size="sm"
 *   footer={<Button onClick={save}>Save</Button>}>
 *   <Input … />
 * </AppDialog>
 */
export function AppDialog({
  open,
  onOpenChange,
  modal,
  trigger,
  title,
  description,
  icon: Icon,
  hideHeader = false,
  footer,
  size = 'md',
  closeMode = 'auto',
  className,
  bodyClassName,
  children,
}: Readonly<AppDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={closeMode !== 'none'}
        {...closeGuards(closeMode)}
        className={cn(
          'flex max-h-[90dvh] flex-col gap-4',
          sizes[size],
          className
        )}
      >
        <DialogHeader className={cn(hideHeader && 'sr-only')}>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 shrink-0" />}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children != null && (
          <div
            className={cn(
              'scrollbar-thin -mx-1 min-h-0 flex-1 overflow-y-auto px-1',
              bodyClassName
            )}
          >
            {children}
          </div>
        )}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
