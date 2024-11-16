import React from 'react';
import { Send, Clock, AlertTriangle, CheckCircle, BarChart } from 'lucide-react';
import type { Analytics } from '../types';

interface AnalyticsPanelProps {
  analytics: Analytics;
  compact?: boolean;
}

export default function AnalyticsPanel({ analytics, compact = false }: AnalyticsPanelProps) {
  const stats = [
    {
      name: 'Total Emails',
      value: analytics.totalEmails,
      icon: Send,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Sent',
      value: analytics.sentEmails,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending',
      value: analytics.pendingEmails,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Failed',
      value: analytics.failedEmails,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Response Rate',
      value: `${analytics.responseRate}%`,
      icon: BarChart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center">
              <div className={`${stat.bgColor} rounded-md p-2`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}