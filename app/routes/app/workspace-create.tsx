import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { Protect } from '~/components/auth/protect';
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from '~/lib/schema/workspace-schema';
import { useCreateWorkspace } from '~/features/workspaces';

export default function WorkspaceCreatePage() {
  const navigate = useNavigate();
  const createWorkspace = useCreateWorkspace();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  const onSubmit = (data: CreateWorkspaceInput) => {
    createWorkspace.mutate(data, {
      onSuccess: (result) => {
        navigate(`/app/workspaces/${result.id}`);
      },
    });
  };

  return (
    <Protect roles={['creator', 'admin']}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          to="/app/workspaces"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create Workspace
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up a collaborative workspace for your team.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Health Data Team"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description{' '}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="What will this workspace be used for?"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('description')}
                />
              </div>

              {/* Role descriptions */}
              <div className="rounded-lg border p-4 space-y-3">
                <p className="text-sm font-medium">Workspace Roles</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Badge variant="default" className="mt-0.5 shrink-0">
                      Admin
                    </Badge>
                    <span>
                      Full control - manage members, settings, publish datasets,
                      delete workspace
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5 shrink-0">
                      Creator
                    </Badge>
                    <span>Create, edit, version, and publish datasets</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      Member
                    </Badge>
                    <span>Read-only access to datasets and analytics</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  You will be the admin of this workspace.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={createWorkspace.isPending}>
                  {createWorkspace.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Workspace
                </Button>
                <Button asChild variant="outline">
                  <Link to="/app/workspaces">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Protect>
  );
}
