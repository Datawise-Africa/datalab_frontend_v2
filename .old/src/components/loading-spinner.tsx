import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex h-32 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  );
}
