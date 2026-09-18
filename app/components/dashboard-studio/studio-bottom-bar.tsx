import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';

/** Page tabs along the bottom edge (Rows / Clay style). */
export function StudioBottomBar() {
  const {
    definition,
    activePage,
    setActivePageId,
    setSelectedId,
    addPage,
    deletePage,
  } = useStudio();
  const { preview } = useStudioUi();
  const canDelete = definition.pages.length > 1;

  return (
    <nav
      aria-label="Pages"
      className="flex h-10 shrink-0 items-center gap-1 border-t bg-background px-2"
    >
      <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {definition.pages.map((page) => {
          const active = page.id === activePage?.id;
          return (
            <div
              key={page.id}
              className={cn(
                'flex shrink-0 items-center rounded-md',
                active && 'bg-primary/10 text-primary'
              )}
            >
              <button
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  setActivePageId(page.id);
                  setSelectedId(undefined);
                }}
                className={cn(
                  'max-w-48 truncate px-3 py-1.5 text-xs font-medium',
                  !active && 'text-muted-foreground hover:text-foreground'
                )}
              >
                {page.title || 'Untitled page'}
              </button>
              {active && !preview && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={`${page.title} options`}
                      className="mr-1 rounded p-0.5 hover:bg-primary/10"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start">
                    <DropdownMenuItem
                      disabled={!canDelete}
                      onSelect={deletePage}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete page
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>
      {!preview && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 text-xs"
          onClick={addPage}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Page
        </Button>
      )}
    </nav>
  );
}
