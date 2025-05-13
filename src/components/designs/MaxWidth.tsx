import { cn } from '../../lib/utils/cn';

type MaxWidthProps = {
  children: React.ReactNode;
  className?: string;
};
export default function MaxWidth({ children, className }: MaxWidthProps) {
  return (
    <div className={cn('max-w-[1920px] mx-auto', className)}>{children}</div>
  );
}
