import type { PaginatedResponse } from '@/constants/pagination';

export type BecomeDatasetCreatorType = {
  id: number;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  affiliation: string;
  expertise: string;
  reason_for_joining: string;
  past_work_files: string[];
  status: 'Pending' | 'In review' | 'Approved' | 'Rejected';
  created_at: string;
  approved_at?: string;
};
export const getDatasetCreatorBadge = (
  status: BecomeDatasetCreatorType['status'],
) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-50 text-amber-800';

    case 'Approved':
      return 'bg-green-50 text-green-700';

    case 'Rejected':
      return 'bg-red-50 text-red-700';

    case 'In review':
      return 'bg-yellow-50 text-yellow-700';
    default:
      return '';
  }
};
export type PaginatedGetBecomeDatasetCreatorResponse =
  PaginatedResponse<BecomeDatasetCreatorType>;
