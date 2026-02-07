import React, { useEffect, useState, useRef } from 'react';
import { Scroll } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/api/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewsletterAlert {
  id: string;
  heading: string;
  content: string;
  created_at: string;
}

const NewsletterAlertsPanel = () => {
  const [alerts, setAlerts] = useState<NewsletterAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<NewsletterAlert[]>('/newsletters').catch(() => []);
      const list = Array.isArray(data) ? data : [];
      setAlerts(list.sort((a, b) => {
        const da = (a as { created_at?: string; createdAt?: string }).created_at ?? (a as { createdAt?: string }).createdAt ?? '';
        const db = (b as { created_at?: string; createdAt?: string }).created_at ?? (b as { createdAt?: string }).createdAt ?? '';
        return new Date(db).getTime() - new Date(da).getTime();
      }));
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'bg-green-100 text-green-700 hover:bg-green-200',
      'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'bg-pink-100 text-pink-700 hover:bg-pink-200',
      'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      'bg-teal-100 text-teal-700 hover:bg-teal-200',
      'bg-rose-100 text-rose-700 hover:bg-rose-200'
    ];
    return colors[index % colors.length];
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
          <Scroll className="h-5 w-5" />
          {alerts.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {alerts.length}
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
            <div className="p-6 text-center text-gray-500">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No alerts found</div>
          ) : (
            <div className="divide-y divide-red-100">
              {alerts.map((alert, index) => (
                <div 
                  key={alert.id} 
                  className={`p-4 transition-all duration-200 hover:bg-gray-50/80 ${
                    index % 2 === 0 ? 'hover:bg-red-50/50' : 'hover:bg-purple-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900 hover:text-primary transition-colors duration-200">
                      {alert.heading}
                    </h5>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${getTagColor(index)}`}>
                      {getTimeAgo((alert as { created_at?: string; createdAt?: string }).created_at ?? (alert as { createdAt?: string }).createdAt ?? '')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {alert.content}
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

export default NewsletterAlertsPanel; 