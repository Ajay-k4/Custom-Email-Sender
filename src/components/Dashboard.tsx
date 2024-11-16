import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Mail, Send, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import Header from './Header';
import FileUpload from './FileUpload';
import EmailList from './EmailList';
import AnalyticsPanel from './AnalyticsPanel';
import PromptEditor from './PromptEditor';
import Schedule from './Schedule';
import { emailService } from '../services/emailService';
import type { UploadedData, Analytics, EmailData } from '../types';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [emailList, setEmailList] = useState<EmailData[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalEmails: 0,
    sentEmails: 0,
    pendingEmails: 0,
    scheduledEmails: 0,
    failedEmails: 0,
    responseRate: 0,
  });

  useEffect(() => {
    emailService.onStatusUpdate((emailId, status) => {
      setEmailList(prevList => {
        const newList = prevList.map(email =>
          email.id === emailId ? { ...email, status } : email
        );
        updateAnalytics(newList);
        return newList;
      });
    });
  }, []);

  const updateAnalytics = (emails: EmailData[]) => {
    const newAnalytics = {
      totalEmails: emails.length,
      sentEmails: emails.filter(e => e.status === 'sent').length,
      pendingEmails: emails.filter(e => e.status === 'pending').length,
      scheduledEmails: emails.filter(e => e.status === 'scheduled').length,
      failedEmails: emails.filter(e => e.status === 'failed').length,
      responseRate: emails.length ? (emails.filter(e => e.status === 'sent').length / emails.length) * 100 : 0,
    };
    setAnalytics(newAnalytics);
  };

  const handleDataUpload = (data: UploadedData) => {
    setUploadedData(data);
    setAnalytics(prev => ({
      ...prev,
      totalEmails: data.rows.length,
      pendingEmails: data.rows.length,
    }));
  };

  const handleEmailsScheduled = (emails: EmailData[]) => {
    setEmailList(emails);
    updateAnalytics(emails);
    setActiveTab('monitor');
  };

  const handleEmailStatusUpdate = (emailId: string, status: EmailData['status']) => {
    if (status === 'scheduled') {
      emailService.cancelScheduled(emailId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`${
                activeTab === 'upload'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Data Upload
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`${
                activeTab === 'compose'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Send className="mr-2 h-5 w-5" />
              Compose
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`${
                activeTab === 'schedule'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Clock className="mr-2 h-5 w-5" />
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`${
                activeTab === 'monitor'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              Monitor
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'upload' && <FileUpload onUpload={handleDataUpload} />}
            {activeTab === 'compose' && <PromptEditor />}
            {activeTab === 'schedule' && (
              <Schedule 
                uploadedData={uploadedData}
                onEmailsScheduled={handleEmailsScheduled}
              />
            )}
            {activeTab === 'monitor' && (
              <EmailList 
                emails={emailList}
                onStatusUpdate={handleEmailStatusUpdate}
              />
            )}
            {activeTab === 'analytics' && <AnalyticsPanel analytics={analytics} />}
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <AnalyticsPanel analytics={analytics} compact />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}