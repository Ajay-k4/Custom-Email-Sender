import React, { useState } from 'react';
import { Calendar, Clock, Settings } from 'lucide-react';
import { emailService } from '../services/emailService';
import type { UploadedData, EmailData } from '../types';

interface ScheduleProps {
  uploadedData: UploadedData | null;
  onEmailsScheduled: (emails: EmailData[]) => void;
}

export default function Schedule({ uploadedData, onEmailsScheduled }: ScheduleProps) {
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled' | 'batched'>('immediate');
  const [scheduledTime, setScheduledTime] = useState('');
  const [batchSize, setBatchSize] = useState(50);
  const [interval, setInterval] = useState(60); // minutes

  const handleSchedule = () => {
    if (!uploadedData) return;

    const emails = emailService.scheduleEmails(uploadedData, {
      type: scheduleType,
      scheduledTime,
      batchSize,
      interval,
    });

    onEmailsScheduled(emails);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Emails</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sending Method</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setScheduleType('immediate')}
                className={`p-4 border rounded-lg text-sm font-medium ${
                  scheduleType === 'immediate'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Clock className="h-5 w-5 mx-auto mb-2" />
                Send Immediately
              </button>
              <button
                onClick={() => setScheduleType('scheduled')}
                className={`p-4 border rounded-lg text-sm font-medium ${
                  scheduleType === 'scheduled'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-5 w-5 mx-auto mb-2" />
                Schedule for Later
              </button>
              <button
                onClick={() => setScheduleType('batched')}
                className={`p-4 border rounded-lg text-sm font-medium ${
                  scheduleType === 'batched'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-5 w-5 mx-auto mb-2" />
                Batch Send
              </button>
            </div>
          </div>

          {scheduleType === 'scheduled' && (
            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Time
              </label>
              <input
                type="datetime-local"
                id="scheduledTime"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}

          {scheduleType === 'batched' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="batchSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Size (emails per batch)
                </label>
                <input
                  type="number"
                  id="batchSize"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  min="1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-2">
                  Interval between batches (minutes)
                </label>
                <input
                  type="number"
                  id="interval"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  min="1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
            <p className="text-sm text-gray-600">
              {uploadedData ? `${uploadedData.rows.length} emails will be sent ` : 'No data uploaded. '}
              {scheduleType === 'immediate' && 'immediately'}
              {scheduleType === 'scheduled' && scheduledTime && `at ${new Date(scheduledTime).toLocaleString()}`}
              {scheduleType === 'batched' && `in batches of ${batchSize} every ${interval} minutes`}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSchedule}
              disabled={!uploadedData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Schedule Emails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}