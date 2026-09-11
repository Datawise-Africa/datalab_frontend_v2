import type { ReactNode } from 'react';
import { cn } from '~/lib/utils';
import { closeGuards, type CloseMode } from './app-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const sideSizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl',
} as const;

type AppSheetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  title: ReactNode;
  description?: ReactNode;
  /** Keep the header for screen readers only (content brings its own). */
  hideHeader?: boolean;
  footer?: ReactNode;
  closeMode?: CloseMode;
  /** Width on left/right sheets from `sm` up; full width on phones. */
  size?: keyof typeof sideSizes;
  className?: string;
  /** Body wrapper; defaults to a padded, scrolling column. */
  bodyClassName?: string;
  children?: ReactNode;
};

/**
 * One-import sheet: header, scrolling body and footer wired up; full width on
 * phones. Use the primitives in `./sheet` only for layouts this can't express.
 */
export function AppSheet({
  open,
  onOpenChange,
  trigger,
  side = 'right',
  title,
  description,
  hideHeader = false,
  footer,
  size = 'md',
  closeMode = 'auto',
  className,
  bodyClassName,
  children,
}: Readonly<AppSheetProps>) {
  const vertical = side === 'top' || side === 'bottom';
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side={side}
        showCloseButton={closeMode !== 'none'}
        {...closeGuards(closeMode)}
        className={cn(
          'flex flex-col gap-0 p-0',
          vertical ? 'max-h-[85dvh]' : cn('w-full', sideSizes[size]),
          side === 'bottom' && 'rounded-t-xl',
          className
        )}
      >
        <SheetHeader
          className={cn(hideHeader ? 'sr-only' : 'border-b px-4 py-3 pr-12')}
        >
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : (
            <SheetDescription className="sr-only">{title}</SheetDescription>
          )}
        </SheetHeader>
        {children != null && (
          <div
            className={cn(
              'scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4',
              bodyClassName
            )}
          >
            {children}
          </div>
        )}
        {footer && <SheetFooter className="border-t">{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
