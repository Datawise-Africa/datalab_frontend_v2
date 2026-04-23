import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Trash2 } from 'lucide-react';
import type { WorkspaceMember, WorkspaceRole } from '~/lib/types/workspace';
import { useUpdateMemberRole, useRemoveMember } from '~/features/workspaces';

interface MemberListProps {
  members: WorkspaceMember[];
  workspaceId: string;
  isAdmin: boolean;
}

const roleVariant: Record<WorkspaceRole, 'default' | 'secondary' | 'outline'> =
  {
    admin: 'default',
    creator: 'secondary',
    member: 'outline',
  };

export function MemberList({ members, workspaceId, isAdmin }: MemberListProps) {
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  if (!members.length) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No members yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const { user } = member;
        const initials =
          `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase();

        return (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>

            {isAdmin ? (
              <Select
                defaultValue={member.role}
                onValueChange={(val) =>
                  updateRole.mutate({
                    workspaceId,
                    memberId: member.id,
                    role: val as WorkspaceRole,
                  })
                }
              >
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant={roleVariant[member.role]}>{member.role}</Badge>
            )}

            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() =>
                  removeMember.mutate({
                    workspaceId,
                    memberId: member.id,
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
