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
  // Don't render sidebar on mobile if it's not open
  if (isMobile && !isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {shouldShowOverlay && (
        <div
          className="fixed inset-0 bg-gray-200 bg-opacity-50 z-40 lg:hidden transition-all duration-200 ease-in-out"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'relative  flex flex-col h-full border-r border-subtle bg-white transition-all duration-200 ease-in-out',
          {
            'fixed left-0 top-0 z-50 lg:hidden': isMobile,
            'w-16': isCollapsed && !isMobile,
            'w-64': (isCollapsed && isMobile) || !isCollapsed,
            // 'w-64': !isCollapsed,
          },
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-subtle">
          {/* Mobile Close Button */}
          {isMobile && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSidebar}
                className="p-1 h-8 w-8"
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
                      className={`
                        w-full flex items-center justify-baseline space-x-2 py-3
                        ${isCollapsed ? 'px-0' : 'px-3'}
                      `}
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={'/app/dataset-creator-dashboard/'}
                  // variant="default"
                  className={`
                    w-full flex items-center justify-center space-x-2 py-3 text-subtle bg-primary rounded
                    ${isCollapsed && !isMobile ? 'px-0' : 'px-4'}
                  `}
                >
                  <LucidePlus className="h-4 w-4" />
                  {(!isCollapsed || isMobile) && (
                    <span className="text-sm font-medium">Upload Dataset</span>
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
        <div className="flex-shrink-0 p-4 border-t border-subtle">
          <BecomeDatasetCreatorBadge
            collapsed={isCollapsed}
            isMobile={isMobile}
          />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`
                    w-full p-0 h-auto hover:bg-gray-50
                    ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}
                  `}
                >
                  <div
                    className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={''} />
                      <AvatarFallback className="border border-subtle">
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
              className={`
                w-full p-0 h-auto hover:bg-gray-50
                ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}
              `}
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
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
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
                className="w-full p-0 flex items-center justify-center h-10"
                asChild
              >
                <Link
                  to={props.href}
                  className="w-full p-0 flex items-center justify-center h-10"
                >
                  {/* Icon */}
                  {props.icon && (
                    <span className="flex items-center justify-center w-5 h-5">
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
                      className="w-full p-0 flex items-center justify-center h-10"
                    >
                      {child.icon && (
                        <span className="flex items-center justify-center w-5 h-5">
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
      <AccordionTrigger className="no-underline hover:no-underline py-2 px-3 hover:bg-gray-50 rounded-md">
        <div className="flex items-center space-x-3">
          {props.icon && (
            <span className="flex items-center justify-center w-5 h-5 text-gray-600">
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
      className="w-full justify-start py-2 px-3 h-auto hover:bg-gray-50 rounded-md"
    >
      <Link to={props.href} className="flex items-center space-x-3">
        {props.icon && (
          <span className="flex items-center justify-center w-5 h-5 text-gray-600">
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
  return (
    <DropdownMenuContent
      className="w-64 bg-white   p-4 shadow-lg border border-subtle rounded-md mb-2"
      side={isMobile ? 'top' : 'right'}
      // alignOffset={10}
    >
      <DropdownMenuLabel>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User Avatar" className="border" />
            <AvatarFallback className="border">CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Data Explorer</span>
            <span className="text-sm font-medium">
              {firstName} {lastName}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer">
        <Link to={'/#'} className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        <Link to={'/#'} className="flex items-center">
          <LucideCog className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Upload Dataset</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        Become a dataset creator
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        <a
          href="/#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          {/* New tab icon */}
          <SquareArrowOutUpRight className="h-5 w-5 mr-2" />
          Go to main site
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer text-red-600">
        <Button
          variant="ghost"
          className="w-full text-left inline-flex items-center justify-baseline"
          onClick={() => dispatch(actions.LOGOUT())}
        >
          <LucideLogOut className="h-5 w-5 mr-2" />

          <span className="text-sm font-medium">Logout</span>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
