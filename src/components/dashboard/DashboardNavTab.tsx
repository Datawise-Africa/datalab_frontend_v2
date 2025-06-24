import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Link, useLocation } from 'react-router-dom';
// Navigation Tab Component
export type DashboardNavTabProps = {
  icon: string;
  label: string;
  href: string;
  showLabel?: boolean;
};

export function DashboardNavTab({
  icon,
  label,
  showLabel = true,
  href,
}: DashboardNavTabProps) {
  const pathUrl = useLocation().pathname;
  const isActive = pathUrl === href;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${showLabel ? 'space-x-2' : 'h-10 w-10 justify-center p-0'} ${
              isActive
                ? 'text-primary border-primary rounded-b-none border-b-2'
                : 'hover:bg-primary/10 text-gray-600 hover:text-gray-900'
            } `}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              <img
                src={icon}
                alt={`${label} icon`}
                className="mr-2 inline-block h-4 w-4"
              />
            </div>
            {showLabel && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {!showLabel && (
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
