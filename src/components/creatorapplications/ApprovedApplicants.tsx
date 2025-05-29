'use client';

import React, { useState } from 'react';
import ApplicantDetailsModal from './ApplicantsModal';
import { MoreVertical, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useDatasetCreator from '@/hooks/use-dataset-creator';
import { cn } from '@/lib/utils';
import { getDatasetCreatorBadge } from '@/lib/types/dataset-creator';

export default function ApprovedApplicantsTable() {
  const {
    filteredDataByStatus,
    data,
    setSelectedApplicantID,
    selectedApplicant,
    isLoading,
  } = useDatasetCreator();

  const [searchTerm, setSearchTerm] = useState('');
  const approvedApplicants = filteredDataByStatus('Approved').filter(
    (applicant) =>
      `${applicant.user.first_name} ${applicant.user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      applicant.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log('All data:', data);
console.log('Approved:', filteredDataByStatus('Approved'));

  const [modalOpen, setModalOpen] = React.useState(false);

  const openModal = (id: number) => {
    setSelectedApplicantID(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApplicantID(null);
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading approved applicants...</div>;
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Approved Creator Applications
      </h1>
      <p className="mt-1 text-gray-500">
        Review and manage approved applications from  dataset creators.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 w-full"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[200px]">Applicant</TableHead>
              <TableHead>Affiliation</TableHead>
              <TableHead>Expertise</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvedApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No approved applicants found.
                </TableCell>
              </TableRow>
            ) : (
              approvedApplicants.map((applicant) => (
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
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                        getDatasetCreatorBadge(applicant.status),
                      )}
                    >
                      {applicant.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => openModal(applicant.id)}
                      className="h-8 w-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedApplicant && (
        <ApplicantDetailsModal
          isOpen={modalOpen}
          onClose={closeModal}
          applicant={selectedApplicant}
          handleChangeStatus={() => {}}
        />
      )}
    </div>
  );
}
