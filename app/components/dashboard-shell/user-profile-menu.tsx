import { Link } from 'react-router';
import { Settings, Mail, ArrowLeft, LogOut, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useAppSelector } from '~/store';
import { useLogout } from '~/features/auth';

export function UserProfileMenu() {
  const user = useAppSelector((s) => s.auth.user);
  const logout = useLogout();

  if (!user) return null;

  const initials =
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() ||
    '?';

  const roleBadge =
    user.user_role === 'admin'
      ? 'Admin'
      : user.user_role === 'creator'
        ? 'Creator'
        : 'Member';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 px-1.5 data-[state=open]:bg-muted"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-3 py-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
            <Badge
              variant="secondary"
              className="mt-1 h-4 px-1.5 py-0 text-[10px]"
            >
              {roleBadge}
            </Badge>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/app/account-settings" className="cursor-pointer">
            <Settings className="h-4 w-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/app/invitations" className="cursor-pointer">
            <Mail className="h-4 w-4" />
            My Invitations
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/" className="cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => logout.mutate()}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
