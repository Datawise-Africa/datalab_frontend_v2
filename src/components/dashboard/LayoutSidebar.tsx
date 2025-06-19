import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';
import {
  ChevronDown,
  LucideCog,
  LucideLogOut,
  LucidePlus,
  SquareArrowOutUpRight,
  User,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { cn } from '@/lib/utils';
import BecomeDatasetCreatorBadge from './BecomeDatasetCreatorBadge';
import { useAuth } from '@/context/AuthProvider';
import { Link } from 'react-router-dom';
import type { SidebarLinkType } from '@/lib/types/sidebar';
import { AuthPerm } from '@/lib/auth/perm';
import { IconParkOutlineDataUser } from '../icons/IconParkOutlineDataUser';
import useCan from '@/hooks/use-can';

type LayoutSidebarProps = {
  links: SidebarLinkType[];
  isCollapsed?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  shouldShowOverlay?: boolean;
  toggleSidebar?: () => void;
  closeSidebar?: () => void;
};

export default function LayoutSidebar({
  links,
  isCollapsed = false,
  isMobile = false,
  isOpen = true,
  shouldShowOverlay = false,
  toggleSidebar,
  closeSidebar,
}: LayoutSidebarProps) {
  const { isAuthenticated, state: authState, setIsAuthModalOpen } = useAuth();

  const authPerm = AuthPerm.getInstance();
  // Don't render sidebar on mobile if it's not open
  if (isMobile && !isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {shouldShowOverlay && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-gray-200 transition-all duration-200 ease-in-out lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'border-subtle relative flex h-full flex-col border-r bg-white transition-all duration-200 ease-in-out',
          {
            'fixed top-0 left-0 z-50 lg:hidden': isMobile,
            'w-16': isCollapsed && !isMobile,
            'w-64': (isCollapsed && isMobile) || !isCollapsed,
            // 'w-64': !isCollapsed,
          },
        )}
      >
        {/* Header */}
        <div className="border-subtle flex-shrink-0 border-b p-4">
          {/* Mobile Close Button */}
          {isMobile && (
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSidebar}
                className="h-8 w-8 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Collapse Toggle (Desktop only) */}
          {!isMobile && (
            <div className="mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="flex">
                    <Button
                      variant="ghost"
                      onClick={toggleSidebar}
                      className={`flex w-full items-center justify-baseline space-x-2 py-3 ${isCollapsed ? 'px-0' : 'px-3'} `}
                    >
                      <img
                        src={'/assets/datalab/collapseicon.png'}
                        alt="Collapse"
                        className={`h-6 w-6 ${isCollapsed ? 'rotate-180' : ''} transition-transform`}
                      />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">Collapse</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="text-subtle">
                      <p>Expand Sidebar</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Upload Button */}
          {isAuthenticated &&
            authPerm.hasPermission('dataset_creator', authState.userRole) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={'/app/dataset-creator-dashboard/'}
                      // variant="default"
                      className={`text-subtle bg-primary flex w-full items-center justify-center space-x-2 rounded py-3 ${isCollapsed && !isMobile ? 'px-0' : 'px-4'} `}
                    >
                      <LucidePlus className="h-4 w-4" />
                      {(!isCollapsed || isMobile) && (
                        <span className="text-sm font-medium">
                          Upload Dataset
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && !isMobile && (
                    <TooltipContent side="right" className="text-subtle">
                      <p>Upload Dataset</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4">
          {!isCollapsed || isMobile ? (
            <Accordion type="multiple" className="w-full space-y-2">
              {links.map((link) => (
                <SidebarItem key={link.label} {...link} isCollapsed={false} />
              ))}
            </Accordion>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <SidebarItem key={link.label} {...link} isCollapsed={true} />
              ))}
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="border-subtle flex-shrink-0 border-t p-4">
          <BecomeDatasetCreatorBadge
            collapsed={isCollapsed}
            isMobile={isMobile}
          />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`h-auto w-full p-0 hover:bg-gray-50 ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'} `}
                >
                  <div
                    className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={''} />
                      <AvatarFallback className="border-subtle border">
                        {authState.firstName!.charAt(0)}
                        {authState.lastName!.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {(!isCollapsed || isMobile) && (
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {authState.firstName} {authState.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {authState.email}
                        </span>
                      </div>
                    )}
                  </div>
                  {(!isCollapsed || isMobile) && (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <SidebarUserDropdown isMobile={isMobile} />
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className={`h-auto w-full p-0 hover:bg-gray-50 ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'} `}
              onClick={() => {
                // Handle login/signup action
                setIsAuthModalOpen(true);
              }}
            >
              <div
                // className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}
                className={cn(
                  'flex items-center',
                  isCollapsed && !isMobile ? 'justify-center' : 'space-x-3',
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                {(!isCollapsed || isMobile) && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Login/Signup</span>
                    <span className="text-xs text-gray-500">
                      Login to your account
                    </span>
                  </div>
                )}
              </div>
              {(!isCollapsed || isMobile) && (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function SidebarItem(props: SidebarLinkType & { isCollapsed?: boolean }) {
  const { isCollapsed = false } = props;
  const hasChildren = props.children && props.children.length > 0;

  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {/* Parent item with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-10 w-full items-center justify-center p-0"
                asChild
              >
                <Link
                  to={props.href}
                  className="flex h-10 w-full items-center justify-center p-0"
                >
                  {/* Icon */}
                  {props.icon && (
                    <span className="flex h-5 w-5 items-center justify-center">
                      {typeof props.icon !== 'string' ? (
                        <props.icon size={20} className="text-gray-600" />
                      ) : (
                        <img
                          src={props.icon}
                          alt={props.label}
                          className="h-5 w-5 text-gray-600"
                        />
                      )}
                    </span>
                  )}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-subtle">
              <p>{props.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Children items with tooltips */}
        {hasChildren &&
          props.children!.map((child) => (
            <TooltipProvider key={child.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" asChild>
                    <Link
                      to={child.href}
                      className="flex h-10 w-full items-center justify-center p-0"
                    >
                      {child.icon && (
                        <span className="flex h-5 w-5 items-center justify-center">
                          {typeof child.icon !== 'string' ? (
                            <child.icon size={20} className="text-gray-600" />
                          ) : (
                            <img
                              src={child.icon}
                              alt={child.label}
                              className="h-5 w-5 text-gray-600"
                            />
                          )}
                        </span>
                      )}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-subtle">
                  <p>{child.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>
    );
  }

  // Expanded state remains the same
  return hasChildren ? (
    <AccordionItem value={props.label} className="border-none">
      <AccordionTrigger className="rounded-md px-3 py-2 no-underline hover:bg-gray-50 hover:no-underline">
        <div className="flex items-center space-x-3">
          {props.icon && (
            <span className="flex h-5 w-5 items-center justify-center text-gray-600">
              {typeof props.icon !== 'string' ? (
                <props.icon size={20} />
              ) : (
                <img
                  src={props.icon}
                  alt={props.label}
                  className="h-5 w-5 text-gray-600"
                />
              )}
            </span>
          )}
          <span className="text-sm font-medium">{props.label}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <div className="ml-4 space-y-1">
          {props.children!.map((child) => (
            <SidebarItem key={child.label} {...child} isCollapsed={false} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  ) : (
    <Button
      variant="ghost"
      className="h-auto w-full justify-start rounded-md px-3 py-2 hover:bg-gray-50"
    >
      <Link to={props.href} className="flex items-center space-x-3">
        {props.icon && (
          <span className="flex h-5 w-5 items-center justify-center text-gray-600">
            {typeof props.icon !== 'string' ? (
              <props.icon size={20} />
            ) : (
              <img
                src={props.icon}
                alt={props.label}
                className="h-5 w-5 text-gray-600"
              />
            )}
          </span>
        )}
        <span className="text-sm font-medium">{props.label}</span>
      </Link>
    </Button>
  );
}

function SidebarUserDropdown({ isMobile }: { isMobile: boolean }) {
  const {
    dispatch,
    actions,
    state: { firstName, lastName },
  } = useAuth();
  const access = useCan();
  console.log({ access });

  return (
    <DropdownMenuContent
      className="border-subtle mb-2 w-64 rounded-md border bg-white p-4 shadow-lg"
      side={isMobile ? 'top' : 'right'}
      // alignOffset={10}
    >
      <DropdownMenuLabel>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User Avatar" className="border" />
            <AvatarFallback className="border">
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Data Explorer</span>
            <span className="text-sm font-medium">
              {firstName} {lastName}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      {/* <DropdownMenuSeparator /> */}
      <hr className="text-subtle my-1" />
      <DropdownMenuItem className="hover:bg-primary/20 cursor-pointer">
        <Link to={'/#'} className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="hover:bg-primary/20 cursor-pointer">
        <Link to={'/#'} className="flex items-center">
          <LucideCog className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Upload Dataset</span>
        </Link>
      </DropdownMenuItem>
      {!access.is_admin && !access.is_dataset_creator && (
        <DropdownMenuItem className="hover:bg-primary/20 cursor-pointer">
          <Link
            to={'/app/become-dataset-creator'}
            className="flex items-center gap-2"
          >
            <IconParkOutlineDataUser />
            Become a dataset creator
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem className="hover:bg-primary/20 cursor-pointer">
        <a
          href="https://datawiseafrica.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          {/* New tab icon */}
          <SquareArrowOutUpRight className="mr-2 h-5 w-5" />
          Go to main site
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50">
        <Button
          variant="ghost"
          className="inline-flex w-full cursor-pointer items-center justify-baseline text-left"
          onClick={() => dispatch(actions.LOGOUT())}
        >
          <LucideLogOut className="mr-2 h-5 w-5" />

          <span className="text-sm font-medium">Logout</span>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
