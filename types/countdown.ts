import { Database } from '../lib/database.types';

export type Countdown = Database['public']['Tables']['countdowns']['Row'];
export type CountdownInsert = Database['public']['Tables']['countdowns']['Insert'];
export type CountdownUpdate = Database['public']['Tables']['countdowns']['Update'];

export interface CountdownWithDaysRemaining extends Countdown {
	days_remaining: number;
	is_overdue: boolean;
	is_today: boolean;
}
