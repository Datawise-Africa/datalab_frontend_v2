export type WorkspaceRole = 'admin' | 'creator' | 'member';

export interface WorkspaceMemberUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
}

export interface WorkspaceMember {
  id: string;
  user: WorkspaceMemberUser;
  role: WorkspaceRole;
  joined_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  owner: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  members: WorkspaceMember[];
  member_count: number;
  dataset_count: number;
  created_at: string;
  updated_at: string;
}

export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface WorkspaceInvitation {
  id: string;
  workspace_name: string;
  invited_email: string;
  role: WorkspaceRole;
  status: InvitationStatus;
  expiration_time: string;
  is_used: boolean;
  created_at: string;
}
