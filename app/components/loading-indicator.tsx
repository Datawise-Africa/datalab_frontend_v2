import { Loader2 } from 'lucide-react';
import { useNavigation } from 'react-router';
import { useEffect, useState } from 'react';

export function LoadingIndicator() {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (navigation.state === 'loading') {
      // Delay showing the loading indicator to avoid flashing
      const timer = setTimeout(() => setShow(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [navigation.state]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-600 animate-progress" />
      <div className="absolute top-4 right-4 bg-white rounded-full shadow-lg p-3">
        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      </div>
    </div>
  );
}

// Simple full-page loader for initial loads
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Inline loader for components
export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}
