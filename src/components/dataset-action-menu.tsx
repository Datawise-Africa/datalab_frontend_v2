import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Download, Send } from 'lucide-react';

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
        <DropdownMenuLabel className="border-primary/10 border-b px-3 py-2 text-sm font-semibold text-gray-900">
          Dataset Actions
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => shareDataset(dataset)}
          className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-green-50 hover:text-green-700"
        >
          <Send className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownloadDataClick(dataset)}
          className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-green-50 hover:text-green-700"
          // disabled={downloadMutation.isPending}
        >
          <Download className="mr-2 h-4 w-4" />
          {'Download'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
