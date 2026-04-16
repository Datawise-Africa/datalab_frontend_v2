import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Database,
  LayoutDashboard,
  Bookmark,
  BarChart3,
  FolderKanban,
  Settings,
  Upload,
  Users,
  UserCheck,
  Phone,
  FileText,
} from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '~/components/ui/command';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useAppSelector } from '~/store';
import { AuthPerm } from '~/lib/utils/perm';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const runCommand = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const perm = AuthPerm.getInstance();
  const isCreator = user && perm.hasPermission('creator', user.user_role);
  const isAdmin = user && perm.hasPermission('admin', user.user_role);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search for pages and actions..."
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea className="max-h-80">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Browse">
            <CommandItem onSelect={() => runCommand('/datasets')}>
              <Database className="mr-2 h-4 w-4" />
              Datasets
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/dashboards')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboards
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/research/reports')}>
              <FileText className="mr-2 h-4 w-4" />
              Research Reports
            </CommandItem>
            <CommandItem onSelect={() => runCommand('/contact')}>
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </CommandItem>
          </CommandGroup>

          {isAuthenticated && (
            <CommandGroup heading="Dashboard">
              <CommandItem onSelect={() => runCommand('/app')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Overview
              </CommandItem>
              <CommandItem onSelect={() => runCommand('/app/bookmarks')}>
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmarks
              </CommandItem>
              {isCreator && (
                <>
                  <CommandItem
                    onSelect={() => runCommand('/app/creator-dashboard')}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    My Datasets
                  </CommandItem>
                  <CommandItem
                    onSelect={() => runCommand('/app/upload-dataset')}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Dataset
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand('/app/analytics')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </CommandItem>
                </>
              )}
              <CommandItem onSelect={() => runCommand('/app/workspaces')}>
                <FolderKanban className="mr-2 h-4 w-4" />
                Workspaces
              </CommandItem>
              <CommandItem onSelect={() => runCommand('/app/account-settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </CommandItem>
            </CommandGroup>
          )}

          {isAdmin && (
            <CommandGroup heading="Admin">
              <CommandItem onSelect={() => runCommand('/app/applications')}>
                <Users className="mr-2 h-4 w-4" />
                Applications
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand('/app/approved-creators')}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Approved Creators
              </CommandItem>
            </CommandGroup>
          )}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
