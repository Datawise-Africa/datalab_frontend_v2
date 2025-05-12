import { cn } from '../../lib/utils/cn';

export default function MaxWidth({ children, className }) {
  return <div className={cn('max-w-[1920px] mx-auto', className)}>{children}</div>;
}
