'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Share, Download } from 'lucide-react';
import { FancyToast } from '@/lib/utils/toaster';

interface DatasetActionsMenuProps {
  datasetId: string;
  datasetTitle: string;
}

export function DatasetActionsMenu({
  datasetId,
  datasetTitle,
}: DatasetActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function downloadDataset(format: string) {
    // This function would typically call an API to initiate the download
    // For now, we'll just simulate a download URL
    return new Promise<{ downloadUrl: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          downloadUrl: `https://example.com/dataset-${datasetId}.${format}`,
        });
      }, 1000); // Simulate network delay
    });
  }

  const downloadMutation = useMutation({
    mutationFn: (format: string) => downloadDataset(format),
    onSuccess: () => {
      // toast({
      //   title: "Download Started",
      //   description: "Your dataset download has been initiated.",
      // })
      // // Handle download URL if provided
      // if (data.downloadUrl) {
      //   window.open(data.downloadUrl, "_blank")
      // }
      FancyToast.success('Download started successfully!', {
        title: 'Download Initiated',
        duration: 3000,
      });
    },
    onError: (error) => {
      // toast({
      //   title: "Download Failed",
      //   description: "Failed to start download. Please try again.",
      //   variant: "destructive",
      // })
      FancyToast.error(`Download failed: ${error.message}`, {
        title: 'Download Error',
        duration: 5000,
      });
    },
  });

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: datasetTitle,
          text: 'Check out this dataset',
          url: url,
        });
        // toast({
        //   title: "Shared Successfully",
        //   description: "Dataset link has been shared.",
        // })
        FancyToast.success('Dataset link shared successfully!', {
          title: 'Share Successful',
          duration: 3000,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // toast({
        //   title: "Link Copied",
        //   description: "Dataset link has been copied to clipboard.",
        // })
        FancyToast.success('Dataset link copied to clipboard!', {
          title: 'Copy Successful',
          duration: 3000,
        });
      } catch (error: any) {
        // toast({
        //   title: "Copy Failed",
        //   description: "Failed to copy link to clipboard.",
        //   variant: "destructive",
        // })
        FancyToast.error(`Failed to copy link: ${error.message}`, {
          title: 'Copy Error',
          duration: 5000,
        });
      }
    }
    setIsOpen(false);
  };

  const handleDownload = () => {
    // For now, we'll default to CSV format
    // In a real app, you might want to show a format selection dialog
    downloadMutation.mutate('csv');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDownload}
          className="cursor-pointer"
          disabled={downloadMutation.isPending}
        >
          <Download className="mr-2 h-4 w-4" />
          {downloadMutation.isPending ? 'Downloading...' : 'Download'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
