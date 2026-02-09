import { Database } from '../lib/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  default_reminder_time?: string;
}

export type DatabaseError = {
  message: string;
  code?: string;
};
