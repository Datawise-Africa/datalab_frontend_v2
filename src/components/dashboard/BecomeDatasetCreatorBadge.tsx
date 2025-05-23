import { useState } from 'react';
import { Button } from '../ui/button';
import { X, ScanText } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Link } from 'react-router-dom';
import useDatasetCreator from '@/hooks/use-dataset-creator';

type BecomeDatasetCreatorBadgeProps = {
  collapsed?: boolean;
  isMobile?: boolean;
};

export default function BecomeDatasetCreatorBadge({
  collapsed = false,
  isMobile,
}: BecomeDatasetCreatorBadgeProps) {
  const [show, setShow] = useState(true);
  const { currentStatus: _ } = useDatasetCreator();

  if (collapsed && !isMobile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="w-full p-0 flex items-center justify-center h-10"
              onClick={() => setShow(!show)}
            >
              <Link to="/app/become-dataset-creator">
                <ScanText className="h-5 w-5 text-primary" />
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
    <div className="w-full relative py-6 px-2 mb-4 text-sm bg-primary/10 flex flex-col gap-2 rounded-md">
      <Button
        variant="ghost"
        onClick={() => setShow(!show)}
        className="absolute top-0 right-0 z-10"
        size="sm"
        asChild
      >
        <div>
          <X className="h-4 w-4 text-primary" />
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
        className="text-subtle bg-primary px-2 py-2 rounded-md hover:bg-primary/80 transition-colors duration-200"
      >
        Become a Dataset Creator
      </Link>
    </div>
  ) : (
    <></>
  );
}
