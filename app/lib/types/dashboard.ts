import type { MinimalUser, MinimalWorkspace } from '~/lib/types/common';

export type DashboardStatus = 'DF' | 'PB' | 'AR';

export interface DashboardCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Dashboard {
  id: string;
  title: string;
  slug: string;
  description: string;
  dashboard_url?: string;
  category: DashboardCategory | null;
  owner: MinimalUser;
  workspace: MinimalWorkspace | null;
  is_public: boolean;
  thumbnail: string | null;
  status: DashboardStatus;
  tags: string[];
  /** Backend returns number; spec says string — accept both. */
  average_rating?: number | string;
  total_reviews?: number | string;
  total_bookmarks?: number | string;
  created_at: string;
  updated_at: string;
}

export interface CreateDashboardInput {
  title: string;
  description?: string;
  dashboard_url?: string;
  category?: string | null;
  workspace?: string | null;
  is_public?: boolean;
  thumbnail?: string | null;
  status?: DashboardStatus;
  tags?: string[];
}

export type UpdateDashboardInput = Partial<CreateDashboardInput>;

export interface CreateDashboardCategoryInput {
  name: string;
  description?: string;
}

export type UpdateDashboardCategoryInput =
  Partial<CreateDashboardCategoryInput>;
