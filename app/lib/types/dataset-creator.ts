export type DatasetCreatorStatus =
  | 'Pending'
  | 'In review'
  | 'Approved'
  | 'Rejected';

export interface DatasetCreatorUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface DatasetCreatorFile {
  id: number;
  file: string;
}

export interface BecomeDatasetCreatorType {
  id: number;
  user: DatasetCreatorUser;
  affiliation: string;
  expertise: string;
  reason_for_joining: string;
  past_work_files: DatasetCreatorFile[];
  status: DatasetCreatorStatus;
  created_at: string;
  approved_at: string | null;
}

/** Helper to get the user's display name. */
export function getCreatorDisplayName(user: DatasetCreatorUser): string {
  return `${user.first_name} ${user.last_name}`;
}

export function getDatasetCreatorBadge(status: DatasetCreatorStatus) {
  switch (status) {
    case 'Pending':
      return {
        label: 'Pending',
        className: 'border-amber-200 bg-amber-50 text-amber-700',
      };
    case 'In review':
      return {
        label: 'In Review',
        className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
      };
    case 'Approved':
      return {
        label: 'Approved',
        className: 'border-primary/20 bg-primary/5 text-primary',
      };
    case 'Rejected':
      return {
        label: 'Rejected',
        className: 'border-red-200 bg-red-50 text-red-700',
      };
  }
}
