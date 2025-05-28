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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Application Details
            </h2>
            <Button
              onClick={onClose}
              className="text-gray-400 bg-white hover:white  transition-colors"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Applicant Basic Info */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {applicant.user.first_name} {applicant.user.last_name}
                </h3>
                <p className="text-gray-500 text-sm">{applicant.user.email}</p>
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
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-900">Affiliation</span>
              <span className="text-gray-600">{applicant.affiliation}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-900">Expertise</span>
              <span className="text-gray-600">{applicant.expertise}</span>
            </div>
            <div className="flex justify-between items-center py-2">
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
            <h4 className="font-medium text-gray-900 mb-4">
              Reason for Joining
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 text-sm leading-relaxed">
                {applicant.reason_for_joining || 'No reason provided.'}
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">
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
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                  ),
                )
              ) : (
                <p className="text-gray-500 text-sm">No attachments provided</p>
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
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors font-medium text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </button>
                <button
                  onClick={() => handleChangeStatus(applicant.id, 'Approved')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  <svg
                    className="h-4 w-4 mr-1"
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
                  className="inline-flex items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-md hover:bg-orange-50 transition-colors font-medium text-sm"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Revoke Status
                </button>
              </div>
            )}
            {applicant.status === 'Rejected' && (
              <button
                onClick={() => handleChangeStatus(applicant.id, 'Approved')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
              >
                <svg
                  className="h-4 w-4 mr-1"
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
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  <svg
                    className="h-4 w-4 mr-1"
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
                  className="inline-flex items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-md hover:bg-orange-50 transition-colors font-medium text-sm"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-white transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
