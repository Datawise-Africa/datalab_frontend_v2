import type { IDataset } from '@/lib/types/data-set.ts';
import { ClipboardIcon } from 'lucide-react';
import { FancyToast } from '@/lib/utils/toaster.tsx';

export async function shareDataset(dataset: IDataset) {
  const shareData = {
    title: `Dataset: ${dataset.title}`,
    text: `Check out this dataset: ${dataset.description.slice(0, 100)}...`,
    url: `${window.location.origin}/datasets/${dataset.id}`,
  };

  try {
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      await navigator.share(shareData);
      // showModal('Dataset shared successfully!');
      FancyToast.success('Dataset shared successfully!', {
        duration: 3000,
        position: 'top-right',
        theme: 'light',
        icon: <ClipboardIcon className="h-4 w-4" />,
      });
    } else {
      await navigator.clipboard.writeText(shareData.url);
      FancyToast.success('Dataset link copied to clipboard!', {
        duration: 3000,
        position: 'top-right',
        theme: 'light',
        icon: <ClipboardIcon className="h-4 w-4" />,
      });
    }
  } catch (error) {
    console.error('Error sharing dataset:', error);
    // showModal(`Share this dataset: ${shareData.url}`);
    FancyToast.error('Failed to share dataset. Please try again.', {
      duration: 3000,
      position: 'top-right',
      theme: 'light',
      icon: <ClipboardIcon className="h-4 w-4" />,
    });
  }
}
