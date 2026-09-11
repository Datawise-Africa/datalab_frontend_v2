import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Copy, Share2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Form } from '~/components/ui/form';
import {
  FormPasswordField,
  FormPickerField,
  FormTextField,
} from '~/components/form-fields';
import {
  useCreateDashboardShare,
  useDashboardShareLinks,
  useRevokeDashboardShare,
} from '~/features/dashboard-studio';
import { shareAccessOptions } from '~/lib/constants/dashboard-studio';
import {
  shareLinkSchema,
  type ShareLinkFormValues,
} from '~/lib/schema/dashboard-studio-schema';
import { toastUtils } from '~/lib/utils/toast';

export function ShareDialog({
  dashboardId,
  workspaceId,
  open,
  onOpenChange,
}: Readonly<{
  dashboardId: string;
  workspaceId?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}>) {
  const { data: links = [] } = useDashboardShareLinks(dashboardId, workspaceId);
  const create = useCreateDashboardShare(dashboardId, workspaceId);
  const revoke = useRevokeDashboardShare(dashboardId, workspaceId);
  const form = useForm<ShareLinkFormValues>({
    resolver: zodResolver(shareLinkSchema),
    defaultValues: { access: 'interact', password: '', expires_at: '' },
  });
  const make = form.handleSubmit(async ({ access, password, expires_at }) => {
    const link = await create.mutateAsync({
      access,
      password: password || undefined,
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
    });
    const url = `${globalThis.location.origin}/shared-dashboards/${link.id}`;
    await globalThis.navigator.clipboard.writeText(url);
    toastUtils.success('Share link copied');
    form.setValue('password', '');
  });
  const copy = async (id: string) => {
    await globalThis.navigator.clipboard.writeText(
      `${globalThis.location.origin}/shared-dashboards/${id}`
    );
    toastUtils.success('Link copied');
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share dashboard</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={make} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <FormPickerField
                control={form.control}
                name="access"
                label="Permission"
                options={shareAccessOptions}
                required
              />
              <FormPasswordField
                control={form.control}
                name="password"
                label="Password (optional)"
              />
              <FormTextField
                control={form.control}
                name="expires_at"
                label="Expires (optional)"
                type="datetime-local"
              />
            </div>
            <Button type="submit" disabled={create.isPending}>
              <Share2 className="mr-1.5 h-4 w-4" />
              Create and copy link
            </Button>
          </form>
        </Form>
        <div className="mt-2 space-y-2 border-t pt-4">
          <h3 className="text-sm font-semibold">Active links</h3>
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {link.access === 'interact' ? 'Interactive' : 'View only'}{' '}
                  {link.password_protected && '· Password protected'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(link.created_at).toLocaleDateString()}
                  {link.expires_at
                    ? ` · Expires ${new Date(link.expires_at).toLocaleString()}`
                    : ''}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => void copy(link.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {link.is_active && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => revoke.mutate(link.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!links.length && (
            <p className="text-sm text-muted-foreground">No share links yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
