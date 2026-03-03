import { Database } from '../lib/database.types';

export type Habit = Database['public']['Tables']['habits']['Row'];
export type HabitInsert = Database['public']['Tables']['habits']['Insert'];
export type HabitUpdate = Database['public']['Tables']['habits']['Update'];

export type HabitCompletion = Database['public']['Tables']['habit_completions']['Row'];
export interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[];
}

export interface HabitWithStats extends Habit {
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  completions: HabitCompletion[];
}
