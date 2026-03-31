export type WorkspaceRole = 'admin' | 'creator' | 'member';

export interface WorkspaceMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string | null;
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
