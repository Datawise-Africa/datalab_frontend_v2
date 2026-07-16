import { useState } from 'react';
import { Bell, Download, Bookmark, Star, UserCheck } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Separator } from '~/components/ui/separator';
import { useIsClient } from '~/hooks/use-is-client';

interface Notification {
  id: string;
  type: 'download' | 'bookmark' | 'review' | 'approval';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const iconMap: Record<
  Notification['type'],
  React.ComponentType<{ className?: string }>
> = {
  download: Download,
  bookmark: Bookmark,
  review: Star,
  approval: UserCheck,
};

const colorMap: Record<Notification['type'], string> = {
  download: 'text-blue-500',
  bookmark: 'text-amber-500',
  review: 'text-purple-500',
  approval: 'text-green-500',
};

// Placeholder - replace with real data from API
const mockNotifications: Notification[] = [];

export function NotificationBell() {
  const isClient = useIsClient();
  const [notifications] = useState<Notification[]>(mockNotifications);

  if (!isClient) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <Separator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type];
              const color = colorMap[notification.type];

              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
