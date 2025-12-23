'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notifications as initialNotifications } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';
import { Check, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState(initialNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
    toast({ title: 'All notifications marked as read.' });
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({ title: 'Notification deleted.', variant: 'destructive' });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>View and manage all your system notifications.</CardDescription>
          </div>
          <Button variant="outline" onClick={handleMarkAllAsRead}>Mark All as Read</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={cn(
                'flex items-start gap-4 rounded-lg border p-4 transition-colors',
                !notification.read && 'bg-primary/5'
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <notification.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMarkAsRead(notification.id)}>
                        <Check className="h-4 w-4" />
                    </Button>
                )}
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(notification.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
           {notifications.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No notifications right now.</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
