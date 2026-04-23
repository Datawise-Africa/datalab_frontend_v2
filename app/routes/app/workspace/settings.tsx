import { useParams } from 'react-router';
import { Loader2 } from 'lucide-react';
import { WorkspaceSettingsForm } from '~/components/workspaces/workspace-settings-form';
import { useWorkspace, useWorkspaceMembers } from '~/features/workspaces';
import { useAppSelector } from '~/store';
import type { WorkspaceMember } from '~/lib/types/workspace';

export default function WorkspaceSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const { data: workspace, isLoading } = useWorkspace(id!);
  const { data: members } = useWorkspaceMembers(id!);

  const myMember = (members ?? []).find(
    (m: WorkspaceMember) => m.user.id === user?.id
  );
  const isWsAdmin = myMember?.role === 'admin';

  if (isLoading || !workspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!isWsAdmin) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Only workspace admins can edit settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage this workspace&apos;s name, description and access
        </p>
      </div>
      <WorkspaceSettingsForm workspace={workspace} />
    </div>
  );
}
