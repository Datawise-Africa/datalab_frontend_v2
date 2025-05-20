import type { datasetFilterOptions } from '../data/dataset-filter-options';

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
}

export interface IDatasetProfiteers {
  [key: string]: boolean;
  students: boolean;
  non_profit: boolean;
  company: boolean;
  public: boolean;
}

export interface IDatasetTerm {
  id: number;
  term: string;
}

export interface IDatasetRegion {
  id: number;
  region: string;
}

export interface IDatasetKeyword {
  id: number;
  keyword: string;
}

export interface IDatasetDataFile {
  id: number;
  file_url: string;
}

export interface IDataset {
  id: number;
  category: IDatasetCategory;
  title: string;
  description: string;
  dataset_region: string;
  license: string;
  metadata_file: string | null;
  datasheet_file: string | null;
  doi_citation: string | null;
  download_count: number;
  is_premium: boolean;
  is_private: boolean;
  data_file_types: string;
  price: number | null;
  dataset_author: IDatasetAuthor[];
  profiteers: IDatasetProfiteers;
  accepted_term: IDatasetTerm;
  restricted_term: IDatasetTerm;
  created_at: string;
  updated_at: string;
  tags: string[];
  size_bytes: string;
  covered_regions: IDatasetRegion[];
  keywords: IDatasetKeyword[];
  data_files: IDatasetDataFile[];
  review_count: number;
  average_review: number;
}

export type DatasetFilterOptions = {
  [key: string]: string[];
  accessLevel: string[];
  dataType: string[];
  region: string[];
  timeframe: string[];
} & {
  [key in keyof typeof datasetFilterOptions]: string[];
};
