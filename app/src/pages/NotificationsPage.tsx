import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Check,
  FileText,
  Award,
  Calendar,
} from 'lucide-react';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New exam available',
      message: 'Data Structures Mid-Term is now open for registration',
      type: 'info',
      time: '5 minutes ago',
      read: false,
      icon: FileText,
    },
    {
      id: 2,
      title: 'Results published',
      message: 'Your Calculus I Final Exam results are now available',
      type: 'success',
      time: '1 hour ago',
      read: false,
      icon: Award,
    },
    {
      id: 3,
      title: 'Exam reminder',
      message: 'Web Development quiz starts in 24 hours',
      type: 'warning',
      time: '3 hours ago',
      read: true,
      icon: Calendar,
    },
    {
      id: 4,
      title: 'System maintenance',
      message: 'Scheduled maintenance on Feb 10, 2024 at 2:00 AM',
      type: 'info',
      time: '1 day ago',
      read: true,
      icon: Info,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500 bg-green-100';
      case 'warning':
        return 'text-amber-500 bg-amber-100';
      case 'error':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-blue-500 bg-blue-100';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">Stay updated with your exam activities</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            All Notifications
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">{unreadCount} new</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 p-4 rounded-lg transition-colors ${
                  notification.read ? 'bg-white' : 'bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                  <notification.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-medium ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications</h3>
              <p className="text-slate-500">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
