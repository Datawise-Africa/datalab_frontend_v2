export type DatasetStatus = 'PB' | 'AR' | 'DF';

export interface IDatasetCategory {
  id: number;
  title: string;
}

export interface IDatasetAuthor {
  id: number;
  title: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  affiliation?: string | null;
}

export interface IDatasetProfiteers {
  [key: string]: boolean;
  students: boolean;
  non_profit: boolean;
  company: boolean;
  public: boolean;
}

export interface IDatasetDataFile {
  id: number;
  file_name: string;
  s3_url: string;
  file_size: number;
  file_size_display: string;
  content_type: string;
}

export interface IDatasetOriginRegion {
  id: number;
  code: string;
  name: string;
}

export interface IDatasetAcceptedTerm {
  id: number;
  data_accuracy: boolean;
  responsible_use: boolean;
  privacy_compliance: boolean;
  rights_ownership: boolean;
}

export interface IDatasetLicense {
  id: number;
  title: string;
  license_type: string;
  description: string;
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
  title: string;
  description: string;
  dataset_image?: string | null;
  doi?: string | null;
  status?: DatasetStatus;
  dataset_region: string;
  license: IDatasetLicense | null;
  data_files: IDatasetDataFile[];
  metadata_files: IDatasetDataFile[];
  datasheet_files: IDatasetDataFile[];
  doi_citation: string | null;
  download_count: number;
  is_premium: boolean;
  is_private: boolean;
  data_file_types: string;
  price: number | null;
  origin_region?: IDatasetOriginRegion;
  authors: IDatasetAuthor[];
  intended_audience: IDatasetProfiteers;
  accepted_terms: IDatasetAcceptedTerm;
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
}

export interface DatasetFilterOptions {
  accessLevel: string[];
  dataType: string[];
  region: string[];
  timeframe: string[];
  [key: string]: string[];
}

/**
 * Standard paginated API response shape.
 * Reusable across all paginated endpoints.
 */
export interface PaginationMeta {
  total_docs: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface Paginated<T> {
  meta: PaginationMeta;
  data: T[];
}

export type DatasetListResponse = Paginated<IDataset>;
