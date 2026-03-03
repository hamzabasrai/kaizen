import { Database } from '../lib/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export type Profile = Omit<ProfileRow, 'settings'> & {
  settings: UserSettings | null;
};

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  default_reminder_time?: string;
}

export type DatabaseError = {
  message: string;
  code?: string;
};
