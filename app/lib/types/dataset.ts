import type { Paginated } from './pagination';

export type DatasetStatus = 'PB' | 'AR' | 'DF';

export interface IDatasetCategory {
  id: string;
  name: string;
  slug: string;
}

interface IDatasetAuthor {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  role: 'creator' | 'contributor';
}

interface IDatasetAccess {
  access_type: 'public' | 'restricted';
  access_instructions: string;
}

export interface IDatasetLicense {
  id: string;
  identifier: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  license_type: string;
  allows_commercial_use: boolean;
  allows_modification: boolean;
  requires_attribution: boolean;
  allows_redistribution: boolean;
  requires_share_alike: boolean;
  is_active: boolean;
}

export interface IDatasetTermsAndConditions {
  id: number;
  title: string;
  description: string;
}

export interface DatasetReviewType {
  id: number;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  dataset: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface IDataset {
  id: string;
  category: IDatasetCategory;
  origin_region: string | null;
  title: string;
  description: string;
  dataset_image?: string | null;
  doi?: string | null;
  status?: DatasetStatus;
  license: IDatasetLicense | null;
  doi_citation: string | null;
  download_count: number;
  is_premium: boolean;
  is_private: boolean;
  price: number | null;
  authors: IDatasetAuthor[];
  access: IDatasetAccess;
  terms_and_conditions?: IDatasetTermsAndConditions;
  created_at: string;
  updated_at: string;
  tags: string[];
  size_bytes: string;
  covered_regions: string;
  keywords: string;
  review_count: number;
  average_review: number;
  dataset_size: number;
  views_count: number;
  reviews: DatasetReviewType[];
  workspace_id?: string | null;
  workspace?: { id: string; name: string } | null;
}

export interface DatasetFilterOptions {
  accessLevel: string[];
  dataType: string[];
  region: string[];
  timeframe: string[];
  [key: string]: string[];
}

export type DatasetListResponse = Paginated<IDataset>;
