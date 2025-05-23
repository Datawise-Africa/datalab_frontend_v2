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
            className={`
              flex items-center px-3 py-2 text-sm font-medium transition-all duration-200
              ${showLabel ? 'space-x-2' : 'w-10 h-10 p-0 justify-center'}
              ${
                isActive
                  ? 'text-primary  border-b-2 border-primary rounded-b-none '
                  : 'text-gray-600 hover:text-gray-900 hover:bg-primary/10'
              }
            `}
          >
            <div className="flex items-center justify-center w-5 h-5">
              <img
                src={icon}
                alt={`${label} icon`}
                className="inline-block w-4 h-4 mr-2"
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
