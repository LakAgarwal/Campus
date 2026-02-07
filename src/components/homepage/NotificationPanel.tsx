import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api, getCurrentUserId } from '@/api/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        setNotifications([]);
        return;
      }
      const data = await api.get<Notification[]>(`/notifications?userId=${userId}`).catch(() => []);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          ref={triggerRef}
          variant="ghost" 
          size="icon" 
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[450px] p-0 bg-white/95 backdrop-blur-sm" 
        align="start"
        sideOffset={5}
        style={{ 
          transform: 'translateX(-40%)',
          marginLeft: '20px'
        }}
      >
        <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No notifications found</div>
          ) : (
            <div className="divide-y divide-red-100">
              {notifications.map((notification, index) => (
                <div
                  key={String(notification.id)} 
                  className={`p-4 transition-all duration-200 hover:bg-gray-50/80 ${
                    index % 2 === 0 ? 'hover:bg-red-50/50' : 'hover:bg-red-100/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900 hover:text-red-600 transition-colors duration-200">
                      {notification.title}
                    </h5>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 bg-red-100 text-red-700 hover:bg-red-200">
                      {getTimeAgo(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {notification.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPanel; 