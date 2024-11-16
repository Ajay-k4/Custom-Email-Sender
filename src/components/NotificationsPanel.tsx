import React from 'react';
import { X, Bell, Mail, AlertCircle } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Campaign Completed',
      message: 'Your email campaign "Q2 Newsletter" has been sent successfully.',
      time: '2 minutes ago',
      icon: Mail,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Approaching Limit',
      message: 'You are approaching your monthly email limit. Consider upgrading your plan.',
      time: '1 hour ago',
      icon: AlertCircle,
    },
    {
      id: 3,
      type: 'info',
      title: 'New Feature Available',
      message: 'Try our new AI-powered email template generator!',
      time: '2 days ago',
      icon: Bell,
    },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
      <div className="h-full flex flex-col">
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <notification.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                    <p className="mt-2 text-xs text-gray-400">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}