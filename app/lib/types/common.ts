export interface MinimalUser {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
}

export interface MinimalWorkspace {
  id: string;
  name: string;
  slug: string;
}
