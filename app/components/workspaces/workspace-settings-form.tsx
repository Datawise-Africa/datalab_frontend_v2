import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  updateWorkspaceSchema,
  type UpdateWorkspaceInput,
} from '~/lib/schema/workspace-schema';
import { useUpdateWorkspace, useDeleteWorkspace } from '~/features/workspaces';
import type { Workspace } from '~/lib/types/workspace';

interface WorkspaceSettingsFormProps {
  workspace: Workspace;
}

export function WorkspaceSettingsForm({
  workspace,
}: Readonly<WorkspaceSettingsFormProps>) {
  const navigate = useNavigate();
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
    },
  });

  const onSubmit = (data: UpdateWorkspaceInput) => {
    updateWorkspace.mutate({ ...data, id: workspace.id });
  };

  const handleDelete = () => {
    deleteWorkspace.mutate(workspace.id, {
      onSuccess: () => navigate('/app/workspaces'),
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold mb-4">Workspace Settings</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('description')}
              />
            </div>
            <Button type="submit" disabled={updateWorkspace.isPending}>
              {updateWorkspace.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Deleting this workspace will remove all associated data. This action
            cannot be undone.
          </p>
          {!confirmDelete ? (
            <Button
              variant="destructive"
              onClick={() => setConfirmDelete(true)}
            >
              Delete Workspace
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteWorkspace.isPending}
              >
                {deleteWorkspace.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm Delete
              </Button>
              <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
