import type { UploadDatasetFormValues } from '~/components/upload-dataset-steps';
import type { Nullable } from '~/lib/types';

export type MyDatasetInterface = {
  id: string;
  name: string;
  description: string;
  dataset_type: UploadDatasetFormValues['dataset_type'];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  license: {
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
  };
  workspace: Nullable<{
    id: string;
    name: string;
  }>;
  origin_region: string;
  authors: {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
    role: 'creator';
  }[];
  is_premium: boolean;
  is_private: boolean;
  access: {
    access_type: string;
    access_instructions: string;
  };
  datasheet: Nullable<{
    id: string;
    motivation: string;
    composition: string;
    collection_process: string;
    preprocessing: string;
    uses: string;
    distribution: string;
    maintenance: string;
    created_at: string;
  }>;
  status: 'PB' | 'DF' | 'AR';
  tags: string[];
  created_at: string;
  updated_at: string;
};

export const DATASET_STATUS_LABELS: Record<
  MyDatasetInterface['status'],
  string
> = {
  PB: 'Published',
  DF: 'Draft',
  AR: 'Archived',
};

export const DATASET_STATUS_VARIANTS: Record<
  MyDatasetInterface['status'],
  string
> = {
  PB: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  DF: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
  AR: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
};
