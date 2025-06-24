import { LoadingSpinner } from '@/components/loading-spinner';

export default function ProfilePageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoadingSpinner />
    </div>
  );
}
