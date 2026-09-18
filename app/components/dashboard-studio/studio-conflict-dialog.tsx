import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AppDialog } from '~/components/ui/app-dialog';
import { useStudio } from './studio-context';

/**
 * Shown when a save is refused because the dashboard was changed elsewhere
 * (another tab or another editor). Autosave stays paused until answered.
 */
export function StudioConflictDialog() {
  const { conflict, resolveConflict } = useStudio();
  const [busy, setBusy] = useState<'reload' | 'overwrite'>();
  const choose = async (choice: 'reload' | 'overwrite') => {
    setBusy(choice);
    try {
      await resolveConflict(choice);
    } catch {
      // A failed overwrite re-opens the dialog (or toasts); nothing else to do.
    } finally {
      setBusy(undefined);
    }
  };

  return (
    <AppDialog
      open={conflict}
      title="This dashboard was changed elsewhere"
      description="Someone (or another tab) saved changes after you opened the studio, so your edits weren't saved. Load their version, or replace it with yours — the replaced version stays in Version history."
      size="sm"
      closeMode="none"
      footer={
        <>
          <Button
            variant="outline"
            disabled={Boolean(busy)}
            onClick={() => void choose('reload')}
          >
            {busy === 'reload' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load latest (discard mine)
          </Button>
          <Button
            disabled={Boolean(busy)}
            onClick={() => void choose('overwrite')}
          >
            {busy === 'overwrite' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Keep mine
          </Button>
        </>
      }
    />
  );
}
