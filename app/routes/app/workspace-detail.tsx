import { Link, useParams } from 'react-router';
import {
  ArrowLeft,
  Loader2,
  Upload,
  Settings,
  Users,
  Database,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import { Protect } from '~/components/auth/protect';
import {
  useWorkspace,
  useWorkspaceDatasets,
  useWorkspaceMembers,
} from '~/features/workspaces';
import { MemberList } from '~/components/workspaces/member-list';
import { InviteMemberDialog } from '~/components/workspaces/invite-member-dialog';
import { WorkspaceSettingsForm } from '~/components/workspaces/workspace-settings-form';
import { useAppSelector } from '~/store';
import type { WorkspaceRole } from '~/lib/types/workspace';

function getUserWorkspaceRole(
  userId: string | undefined,
  members: { id: string; role: WorkspaceRole }[]
): WorkspaceRole | null {
  if (!userId) return null;
  const member = members.find((m) => m.id === userId);
  return member?.role ?? null;
}

export default function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);

  const { data: workspace, isLoading } = useWorkspace(id!);
  const { data: datasets } = useWorkspaceDatasets(id!);
  const { data: members } = useWorkspaceMembers(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Workspace not found</h2>
        <Button asChild variant="outline">
          <Link to="/app/workspaces">Back to Workspaces</Link>
        </Button>
      </div>
    );
  }

  const myRole = getUserWorkspaceRole(user?.id, members ?? []);
  const isWsAdmin = myRole === 'admin';
  const isWsCreator = myRole === 'creator';
  const canManageDatasets = isWsAdmin || isWsCreator;

  return (
    <Protect roles={['dataset_creator', 'admin']}>
      <div className="space-y-6">
        <Link
          to="/app/workspaces"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {workspace.name}
            </h1>
            {workspace.description && (
              <p className="text-muted-foreground mt-1">
                {workspace.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {workspace.member_count} members
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" />
                {workspace.dataset_count} datasets
              </span>
              {myRole && <Badge variant="secondary">{myRole}</Badge>}
            </div>
          </div>
        </div>

        <Tabs defaultValue="datasets">
          <TabsList>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {isWsAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          {/* Datasets tab */}
          <TabsContent value="datasets" className="mt-4 space-y-4">
            {canManageDatasets && (
              <div className="flex justify-end">
                <Button asChild>
                  <Link to={`/app/upload-dataset?workspace=${id}`}>
                    <Upload className="mr-1.5 h-4 w-4" />
                    Upload Dataset
                  </Link>
                </Button>
              </div>
            )}

            {!datasets?.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Database className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">
                  No datasets in this workspace yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {datasets.map((ds) => (
                  <Card key={ds.id}>
                    <CardContent className="p-5">
                      <h3 className="font-medium text-sm mb-1 line-clamp-1">
                        {ds.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {ds.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {ds.status === 'PB'
                            ? 'Published'
                            : ds.status === 'DF'
                              ? 'Draft'
                              : 'Archived'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Members tab */}
          <TabsContent value="members" className="mt-4 space-y-4">
            {isWsAdmin && (
              <div className="flex justify-end">
                <InviteMemberDialog workspaceId={id!} />
              </div>
            )}
            <MemberList
              members={members ?? []}
              workspaceId={id!}
              isAdmin={isWsAdmin}
            />
          </TabsContent>

          {/* Settings tab */}
          {isWsAdmin && (
            <TabsContent value="settings" className="mt-4">
              <WorkspaceSettingsForm workspace={workspace} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Protect>
  );
}
