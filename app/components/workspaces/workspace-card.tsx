import { Link } from 'react-router';
import { Users, Database } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import type { Workspace } from '~/lib/types/workspace';

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const memberAvatars = workspace.members?.slice(0, 4) ?? [];
  const extraCount =
    (workspace.member_count ?? workspace.members?.length ?? 0) -
    memberAvatars.length;

  return (
    <Link to={`/app/workspaces/${workspace.id}`} className="block group">
      <Card className="transition-colors group-hover:border-primary/30 h-full">
        <CardContent className="p-5 flex flex-col h-full">
          <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {workspace.name}
          </h3>
          {workspace.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
              {workspace.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {workspace.member_count}
              </span>
              <span className="flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                {workspace.dataset_count}
              </span>
            </div>

            {/* Member avatars */}
            <div className="flex -space-x-2">
              {memberAvatars.map((member) => (
                <Avatar
                  key={member.id}
                  className="h-6 w-6 border-2 border-card"
                >
                  <AvatarFallback className="bg-muted text-[10px]">
                    {member.user.first_name?.[0]}
                    {member.user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
              {extraCount > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium">
                  +{extraCount}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
