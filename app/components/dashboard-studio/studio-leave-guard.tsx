import { useEffect } from 'react';
import { useBlocker } from 'react-router';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AppDialog } from '~/components/ui/app-dialog';
import { useStudio } from './studio-context';

/**
 * Warns before leaving with unsaved edits: an in-app dialog for route
 * changes, the browser's own prompt for reloads and tab closes.
 */
export function StudioLeaveGuard() {
  const { dirty: definitionDirty, modelDirty, save, saving } = useStudio();
  const dirty = definitionDirty || modelDirty;
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    globalThis.addEventListener('beforeunload', handler);
    return () => globalThis.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const blocked = blocker.state === 'blocked';
  return (
    <AppDialog
      open={blocked}
      onOpenChange={(open) => !open && blocker.reset?.()}
      title="Unsaved changes"
      description={
        modelDirty
          ? "Your data model changes haven't been saved and will be lost if you leave."
          : "Your latest edits haven't been saved yet. Save them before leaving the studio?"
      }
      size="sm"
      closeMode="none"
      footer={
        <>
          <Button variant="ghost" onClick={() => blocker.reset?.()}>
            Stay
          </Button>
          <Button variant="outline" onClick={() => blocker.proceed?.()}>
            Leave without saving
          </Button>
          {definitionDirty && (
            <Button
              disabled={saving}
              onClick={async () => {
                try {
                  await save(false);
                  blocker.proceed?.();
                } catch {
                  // Stay; a conflict opens its own dialog, other errors toast.
                  blocker.reset?.();
                }
              }}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save and leave
            </Button>
          )}
        </>
      }
    />
  );
}
