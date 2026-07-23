import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { X } from 'lucide-react';

const DISMISS_KEY = 'becomeCreatorBanner:dismissed';

export function BecomeCreatorBanner({
  onNavigate,
}: Readonly<{ onNavigate?: () => void }>) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === '1');
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, '1');
    }
  };

  if (dismissed) return null;

  return (
    <div className="relative mx-2 mb-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <p className="mb-1 pr-5 text-sm font-semibold text-foreground">
        Become a Dataset Creator
      </p>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
        Share your data with the world, track engagement, and earn from premium
        datasets.
      </p>
      <Link
        to="/app/become-dataset-creator"
        onClick={onNavigate}
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Apply now
      </Link>
    </div>
  );
}
