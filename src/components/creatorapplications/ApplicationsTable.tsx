'use client';
import React from 'react';
import { useState } from 'react';
import ApplicantDetailsModal from './ApplicantsModal';
import { Check, MoreVertical, Hourglass, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import useDatasetCreator from '@/hooks/use-dataset-creator';
import { cn } from '@/lib/utils';
import {
  getDatasetCreatorBadge,
  type BecomeDatasetCreatorType,
} from '@/lib/types/dataset-creator';

export function ApplicationsTable() {
  // const [applicants, setApplicants] = useState<Applicant[]>([])
  const { data, handleChangeStatus, isStatusUpdateLoading, isLoading,setSelectedApplicantID,selectedApplicant } =
    useDatasetCreator();

  // const changeStatus = async (id: number, action: 'Approve' | 'Reject') => {
  //   if (action === 'Approve') return await handleApprove(id);
  //   else return await handleReject(id);
  // };
  console.log(data);
  // const [selectedApplicant, setSelectedApplicant] =
  //   useState<BecomeDatasetCreatorType | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const openModal = (id:number) => {
    setSelectedApplicantID(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);

    setSelectedApplicantID(null);
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading applicants...</div>;
  }

  // if (er) {
  //   return <div className="py-10 text-center text-red-500">{error}</div>;
  // }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[200px]">Applicant</TableHead>
            <TableHead>Affiliation</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead className="text-right">Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No applicants found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell className="font-medium">
                  <div>
                    {applicant.user.first_name} {applicant.user.last_name}
                    <div className="text-sm text-gray-500">
                      {applicant.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{applicant.affiliation}</TableCell>
                <TableCell>{applicant.expertise}</TableCell>
                <TableCell className="text-right">
                 {new Date(applicant.created_at).toISOString().split('T')[0]}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full  px-2 py-1 text-xs font-medium  ',
                      getDatasetCreatorBadge(applicant.status),
                    )}
                  >
                    {applicant.status}
                  </span>
                </TableCell>
                <TableCell className="text-right  flex justify-end items-center space-x-2">
                  {applicant.status === 'Pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white bg-[#26A37E] border border-[#26A37E] disabled:cursor-not-allowed"
                        onClick={() =>
                          handleChangeStatus(applicant.id, 'Approved')
                        }
                        aria-label="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#EE3481] bg-white border border-[#EE3481]"
                        onClick={() =>
                          handleChangeStatus(applicant.id, 'Rejected')
                        }
                        aria-label="Reject"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-yellow-600 bg-yellow-100 border border-yellow-600"
                        onClick={() =>
                          handleChangeStatus(applicant.id, 'In review')
                        }
                        aria-label="Mark as In Review"
                      >
                        <Hourglass className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {applicant.status === 'Approved' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#EE3481] bg-white border border-[#EE3481] "
                      onClick={() =>
                        handleChangeStatus(applicant.id, 'Rejected')
                      }
                      disabled={isStatusUpdateLoading}
                      aria-label="Mark as Rejected"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  {applicant.status === 'Rejected' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white bg-[#26A37E] border border-[#26A37E] disabled:cursor-not-allowed"
                      onClick={() =>
                        handleChangeStatus(applicant.id, 'Approved')
                      }
                      disabled={isStatusUpdateLoading}
                      aria-label="Mark as Approved"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    onClick={() => openModal(applicant.id)}
                    className="h-8 w-8 flex items-center justify-center bg-fffff hover:bg-white rounded-full"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

            ))
          )}
        </TableBody>
      </Table>
      {selectedApplicant && (
        <ApplicantDetailsModal
          isOpen={modalOpen}
          onClose={closeModal}
          applicant={selectedApplicant}
          handleChangeStatus={handleChangeStatus}
        />
      )}
    </div>
  );
}
