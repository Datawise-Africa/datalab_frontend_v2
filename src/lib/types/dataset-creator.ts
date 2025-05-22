import type { PaginatedResponse } from './utils';

type BecomeDatasetCreatorType = {
  id: 3;
  user: {
    id: 'nYWAjTYumuYg';
    email: 'forinda82@gmail.com';
    first_name: 'Felix';
    last_name: 'Orinda';
  };
  affiliation: 'Datawise';
  expertise: 'Developer';
  reason_for_joining: 'Become dataset creator';
  past_work_files: null;
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected';
};

export type PaginatedGetBecomeDatasetCreatorResponse =
  PaginatedResponse<BecomeDatasetCreatorType>;
