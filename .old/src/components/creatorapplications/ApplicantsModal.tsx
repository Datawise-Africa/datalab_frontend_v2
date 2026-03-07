import { FileText, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getDatasetCreatorBadge,
  type BecomeDatasetCreatorType,
} from '@/lib/types/dataset-creator';
import { Button } from '../ui/button';
import { format } from 'date-fns';

type ApplicantModalProps = {
  applicant: BecomeDatasetCreatorType;
  isOpen: boolean;
  onClose: () => void;
  handleChangeStatus: (
    id: number,
    status: BecomeDatasetCreatorType['status'],
  ) => void;
  getStatusMessage?: () => string | null;
};

export default function ApplicantDetailsModal({
  applicant,
  isOpen,
  onClose,
  handleChangeStatus,
  getStatusMessage,
}: ApplicantModalProps) {
  if (!isOpen || !applicant) return null;

  // const formatDate = (date: string) =>
  //   date ? new Date(date).toLocaleDateString() : 'N/A';

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Application Details
            </h2>
            <Button
              onClick={onClose}
              className="hover:white bg-white text-gray-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Applicant Basic Info */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  {applicant.user.first_name} {applicant.user.last_name}
                </h3>
                <p className="text-sm text-gray-500">{applicant.user.email}</p>
              </div>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
                  getDatasetCreatorBadge(applicant.status),
                )}
              >
                {applicant.status === 'Pending'
                  ? 'Pending Review'
                  : applicant.status}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between py-2">
              <span className="font-medium text-gray-900">Affiliation</span>
              <span className="text-gray-600">{applicant.affiliation}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-medium text-gray-900">Expertise</span>
              <span className="text-gray-600">{applicant.expertise}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-medium text-gray-900">Submitted</span>
              <span className="text-gray-600">
                {applicant.created_at
                  ? format(new Date(applicant.created_at), 'do MMMM yyyy')
                  : 'Unknown'}{' '}
              </span>
            </div>
            {/* {applicant.reviewed && (
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-900">Reviewed</span>
                <span className="text-gray-600">
                  {formatDate(applicant.reviewed)}
                </span>
              </div>
            )} */}
          </div>

          {/* Reason for Joining */}
          <div className="mb-8">
            <h4 className="mb-4 font-medium text-gray-900">
              Reason for Joining
            </h4>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm leading-relaxed text-gray-700">
                {applicant.reason_for_joining || 'No reason provided.'}
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <h4 className="mb-4 font-medium text-gray-900">
              Past Work Attachments
            </h4>
            <div className="space-y-2">
              {applicant.past_work_files &&
              applicant.past_work_files.length > 0 ? (
                applicant.past_work_files.map(
                  (attachment: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <FileText className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                  ),
                )
              ) : (
                <p className="text-sm text-gray-500">No attachments provided</p>
              )}
            </div>
          </div>

          {/* Optional Status Message */}
          {getStatusMessage && getStatusMessage() && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">{getStatusMessage()}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            {applicant.status === 'Pending' && (
              <>
                <button
                  onClick={() => handleChangeStatus(applicant.id, 'Rejected')}
                  className="inline-flex items-center rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleChangeStatus(applicant.id, 'Approved')}
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Approve
                </button>
              </>
            )}
            {applicant.status === 'Approved' && (
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  This application was approved on{' '}
                  {applicant?.approved_at
                    ? new Date(applicant?.approved_at).toLocaleDateString()
                    : 'an unknown date'}
                </p>
                <button
                  onClick={() => handleChangeStatus(applicant.id, 'Rejected')}
                  className="inline-flex items-center rounded-md border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-50"
                >
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Revoke Status
                </button>
              </div>
            )}
            {applicant.status === 'Rejected' && (
              <button
                onClick={() => handleChangeStatus(applicant.id, 'Approved')}
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approve
              </button>
            )}
            {applicant.status === 'In review' && (
              <>
                {' '}
                <button
                  onClick={() => handleChangeStatus(applicant.id, 'Approved')}
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Approve
                </button>
                <button
                  onClick={() => handleChangeStatus(applicant.id, 'Rejected')}
                  className="inline-flex items-center rounded-md border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-50"
                >
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
