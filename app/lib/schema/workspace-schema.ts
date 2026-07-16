import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, 'Workspace name must be at least 3 characters')
    .max(100, 'Workspace name must be at most 100 characters'),
  description: z.string().max(500).optional(),
});

export type CreateWorkspaceInput = z.input<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

export const inviteMemberSchema = z.object({
  email: z.email('Please enter a valid email address'),
  role: z.enum(['admin', 'creator', 'member'], {
    message: 'Please select a role',
  }),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'creator', 'member']),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
