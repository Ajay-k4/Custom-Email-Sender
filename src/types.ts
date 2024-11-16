export interface EmailData {
  id: string;
  companyName: string;
  email: string;
  status: 'pending' | 'sent' | 'scheduled' | 'failed';
  deliveryStatus: 'delivered' | 'bounced' | 'opened' | 'N/A';
  scheduledTime?: string;
}

export interface Analytics {
  totalEmails: number;
  sentEmails: number;
  pendingEmails: number;
  scheduledEmails: number;
  failedEmails: number;
  responseRate: number;
}

export interface UploadedData {
  headers: string[];
  rows: Record<string, string>[];
}