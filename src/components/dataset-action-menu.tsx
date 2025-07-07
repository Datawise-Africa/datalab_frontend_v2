import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Share, Download } from 'lucide-react';

import { shareDataset } from '@/lib/utils/share-dataset';
import type { IDataset } from '@/lib/types/data-set';
import { useAuth } from '@/context/AuthProvider';
import { useDatasetStore } from '@/store/dataset-store';
import useDownloadDataModal from '@/store/use-download-data-modal';

interface DatasetActionsMenuProps {
  // datasetId: string;
  // datasetTitle: string;
  dataset: IDataset;
}

export function DatasetActionsMenu({ dataset }: DatasetActionsMenuProps) {
  const { setDownloadDataset } = useDatasetStore();
  const downloadDataModal = useDownloadDataModal();
  // const { id: datasetId, title: datasetTitle } = dataset;
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadDataClick = (dataset: IDataset) => {
    if (!auth.isAuthenticated) {
      auth.queue.addToQueue([
        {
          function: setDownloadDataset,
          args: [dataset],
        },
        {
          function: downloadDataModal.open,
          args: [],
        },
      ]);
      auth.setIsAuthModalOpen(true);
      return;
    } else {
      setDownloadDataset(dataset);
      downloadDataModal.open();
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-primary/30 w-48 border bg-white shadow-lg"
      >
        <DropdownMenuItem
          onClick={() => shareDataset(dataset)}
          className="cursor-pointer"
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownloadDataClick(dataset)}
          className="cursor-pointer"
          // disabled={downloadMutation.isPending}
        >
          <Download className="mr-2 h-4 w-4" />
          {'Download'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
