import { useState } from 'react';
import { Button } from '../ui/button';
import {
  X,
  ScanText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Link } from 'react-router-dom';
import useDatasetCreator from '@/hooks/use-dataset-creator';
import { useAuth } from '@/context/AuthProvider';
import { AuthPerm } from '@/lib/auth/perm';

type BecomeDatasetCreatorBadgeProps = {
  collapsed?: boolean;
  isMobile?: boolean;
};

// Helper function to get status display info
const getStatusInfo = (status: string) => {
  const statusLower = status.toLowerCase();

  if (statusLower.includes('pending') || statusLower.includes('submitted')) {
    return {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      label: 'Application Pending',
      description: 'Your dataset creator application is under review.',
    };
  }

  if (statusLower.includes('approved') || statusLower.includes('accepted')) {
    return {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Application Approved',
      description:
        'Congratulations! Your dataset creator application has been approved.',
    };
  }

  if (statusLower.includes('rejected') || statusLower.includes('denied')) {
    return {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Application Rejected',
      description:
        'Your dataset creator application was not approved. You can reapply.',
    };
  }

  // Default/unknown status
  return {
    icon: AlertCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Application Status',
    description: `Status: ${status}`,
  };
};

export default function BecomeDatasetCreatorBadge({
  collapsed = false,
  isMobile,
}: BecomeDatasetCreatorBadgeProps) {
  const [show, setShow] = useState(true);
  const authPerm = AuthPerm.getInstance();
  const { isAuthenticated, state } = useAuth();
  const { currentStatus, isLoading } = useDatasetCreator();

  /**
   * If one is an admin or dataset creator we don't need to show the become dataset creator
   * If loading, we also don't show the badge
   * If the current status is 'Confirmed', we don't show the badge
   * This is because the user has already been confirmed as a dataset creator
   * If the user has any of the permissions ['admin', 'dataset_creator'], we don't show the badge
   * This is because they already have the permissions to create datasets
   * If the user is not authenticated, we show the badge
   */
  if (
    isLoading ||
    currentStatus === 'Confirmed' ||
    (isAuthenticated &&
      authPerm.hasAnyPermission(['admin', 'dataset_creator'], state.userRole))
  ) {
    return <></>;
  }

  // If we have a status (request has been made)
  if (currentStatus !== 'N/A' && isAuthenticated) {
    const statusInfo = getStatusInfo(currentStatus);
    const StatusIcon = statusInfo.icon;

    // Collapsed mode (sidebar collapsed, not mobile)
    if (collapsed && !isMobile) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-10 w-full items-center justify-center p-0"
              >
                <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-subtle">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{statusInfo.label}</p>
                <p className="text-xs">{statusInfo.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Mobile or expanded mode
    return (
      <div
        className={`relative mb-4 w-full px-3 py-4 text-sm ${statusInfo.bgColor} border ${statusInfo.borderColor} flex flex-col gap-2 rounded-md`}
      >
        <div className="flex items-start gap-3">
          <StatusIcon
            className={`h-5 w-5 ${statusInfo.color} mt-0.5 flex-shrink-0`}
          />
          <div className="flex flex-1 flex-col gap-1">
            <h3 className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </h3>
            <p className="text-xs leading-relaxed text-gray-700">
              {statusInfo.description}
            </p>
            {(currentStatus.toLowerCase().includes('rejected') ||
              currentStatus.toLowerCase().includes('denied')) && (
              <Link
                to="/app/become-dataset-creator"
                className="mt-1 inline-block text-xs text-blue-600 underline hover:text-blue-800"
              >
                Apply again
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Original logic for when no request has been made
  if (collapsed && !isMobile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-10 w-full items-center justify-center p-0"
              onClick={() => setShow(!show)}
            >
              <Link to="/app/become-dataset-creator">
                <ScanText className="text-primary h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-subtle">
            <p>Become a Dataset Creator</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return show ? (
    <div className="bg-primary/10 relative mb-4 flex w-full flex-col gap-2 rounded-md px-2 py-6 text-sm">
      <Button
        variant="ghost"
        onClick={() => setShow(!show)}
        className="absolute top-0 right-0 z-10"
        size="sm"
        asChild
      >
        <div>
          <X className="text-primary h-4 w-4" />
        </div>
      </Button>
      <div className="flex flex-col gap-2 text-center">
        <h2 className="font-bold">Become a Dataset Creator</h2>
        <p className="text-primary">
          Share your data with the world, track engagement, and earn from
          premium datasets. Apply now to get started!
        </p>
      </div>
      <Link
        to="/app/become-dataset-creator"
        className="text-subtle bg-primary hover:bg-primary/80 rounded-md px-2 py-2 transition-colors duration-200"
      >
        Become a Dataset Creator
      </Link>
    </div>
  ) : (
    <></>
  );
}
