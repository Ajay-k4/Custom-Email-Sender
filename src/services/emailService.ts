import { v4 as uuidv4 } from 'uuid';
import type { EmailData, UploadedData } from '../types';

type ScheduleConfig = {
  type: 'immediate' | 'scheduled' | 'batched';
  scheduledTime?: string;
  batchSize?: number;
  interval?: number;
};

class EmailService {
  private static instance: EmailService;
  private scheduleTimers: Map<string, NodeJS.Timeout>;
  private emailQueue: Map<string, EmailData>;
  private statusUpdateCallbacks: ((emailId: string, status: EmailData['status']) => void)[];

  private constructor() {
    this.scheduleTimers = new Map();
    this.emailQueue = new Map();
    this.statusUpdateCallbacks = [];
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  onStatusUpdate(callback: (emailId: string, status: EmailData['status']) => void) {
    this.statusUpdateCallbacks.push(callback);
  }

  private updateEmailStatus(emailId: string, status: EmailData['status']) {
    const email = this.emailQueue.get(emailId);
    if (email) {
      email.status = status;
      this.emailQueue.set(emailId, email);
      this.statusUpdateCallbacks.forEach(callback => callback(emailId, status));
    }
  }

  private async sendEmail(email: EmailData): Promise<void> {
    try {
      // Simulate email sending with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update status to sent
      this.updateEmailStatus(email.id, 'sent');
      
      // Simulate delivery status update after a delay
      setTimeout(() => {
        const email = this.emailQueue.get(email.id);
        if (email) {
          email.deliveryStatus = 'delivered';
          this.emailQueue.set(email.id, email);
        }
      }, 3000);
    } catch (error) {
      this.updateEmailStatus(email.id, 'failed');
      throw error;
    }
  }

  scheduleEmails(data: UploadedData, config: ScheduleConfig): EmailData[] {
    const emails: EmailData[] = data.rows.map(row => ({
      id: uuidv4(),
      companyName: row.companyName || '',
      email: row.email || '',
      status: 'pending',
      deliveryStatus: 'N/A',
      scheduledTime: config.type === 'scheduled' ? config.scheduledTime : undefined,
    }));

    // Store emails in queue
    emails.forEach(email => this.emailQueue.set(email.id, email));

    switch (config.type) {
      case 'immediate':
        this.sendImmediate(emails);
        break;
      case 'scheduled':
        if (config.scheduledTime) {
          this.sendScheduled(emails, new Date(config.scheduledTime));
        }
        break;
      case 'batched':
        if (config.batchSize && config.interval) {
          this.sendBatched(emails, config.batchSize, config.interval);
        }
        break;
    }

    return emails;
  }

  private sendImmediate(emails: EmailData[]) {
    emails.forEach(email => {
      this.sendEmail(email).catch(console.error);
    });
  }

  private sendScheduled(emails: EmailData[], scheduledTime: Date) {
    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();
    
    if (delay > 0) {
      emails.forEach(email => {
        this.updateEmailStatus(email.id, 'scheduled');
      });

      const timerId = setTimeout(() => {
        this.sendImmediate(emails);
      }, delay);

      // Store timer reference for cleanup
      emails.forEach(email => {
        this.scheduleTimers.set(email.id, timerId);
      });
    } else {
      this.sendImmediate(emails);
    }
  }

  private sendBatched(emails: EmailData[], batchSize: number, intervalMinutes: number) {
    const batches = Array.from({ length: Math.ceil(emails.length / batchSize) }, (_, i) =>
      emails.slice(i * batchSize, (i + 1) * batchSize)
    );

    batches.forEach((batch, index) => {
      batch.forEach(email => {
        this.updateEmailStatus(email.id, 'scheduled');
      });

      const timerId = setTimeout(() => {
        this.sendImmediate(batch);
      }, index * intervalMinutes * 60 * 1000);

      // Store timer reference for cleanup
      batch.forEach(email => {
        this.scheduleTimers.set(email.id, timerId);
      });
    });
  }

  cancelScheduled(emailId: string) {
    const timer = this.scheduleTimers.get(emailId);
    if (timer) {
      clearTimeout(timer);
      this.scheduleTimers.delete(emailId);
      this.updateEmailStatus(emailId, 'pending');
    }
  }

  getEmails(): EmailData[] {
    return Array.from(this.emailQueue.values());
  }
}

export const emailService = EmailService.getInstance();