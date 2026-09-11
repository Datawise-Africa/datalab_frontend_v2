import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AppDialog } from '~/components/ui/app-dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  inviteMemberSchema,
  type InviteMemberInput,
} from '~/lib/schema/workspace-schema';
import { useInviteMember } from '~/features/workspaces';

interface InviteMemberDialogProps {
  workspaceId: string;
}

export function InviteMemberDialog({
  workspaceId,
}: Readonly<InviteMemberDialogProps>) {
  const [open, setOpen] = useState(false);
  const inviteMember = useInviteMember();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { role: 'member' },
  });

  const onSubmit = (data: InviteMemberInput) => {
    inviteMember.mutate(
      { ...data, workspaceId },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <UserPlus className="mr-1.5 h-4 w-4" />
          Invite Member
        </Button>
      }
      title="Invite Member"
      description="Send an invitation to join this workspace."
      size="sm"
      closeMode="explicit"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="invite-member-form"
            disabled={inviteMember.isPending}
          >
            {inviteMember.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Invite
          </Button>
        </>
      }
    >
      <form
        id="invite-member-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 mt-2"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="colleague@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            defaultValue="member"
            onValueChange={(val) =>
              setValue('role', val as InviteMemberInput['role'])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role.message}</p>
          )}
        </div>
      </form>
    </AppDialog>
  );
}
