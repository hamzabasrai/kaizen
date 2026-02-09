import { supabase } from '../lib/supabase';
import { Countdown, CountdownWithDaysRemaining, CountdownInsert, CountdownUpdate } from '../types/countdown';
import { differenceInDays, parseISO, isSameDay, isBefore, startOfDay } from 'date-fns';

export async function getCountdowns(): Promise<Countdown[]> {
  const { data, error } = await supabase
    .from('countdowns')
    .select('*')
    .order('target_date', { ascending: true });

  if (error) throw error;
  return (data || []) as Countdown[];
}

export async function getCountdownById(id: string): Promise<Countdown | null> {
  const { data, error } = await supabase
    .from('countdowns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Countdown | null;
}

export async function createCountdown(countdown: CountdownInsert): Promise<Countdown> {
  const { data, error } = await supabase
    .from('countdowns')
    .insert(countdown)
    .select()
    .single();

  if (error) throw error;
  return data as Countdown;
}

export async function updateCountdown(id: string, updates: CountdownUpdate): Promise<Countdown> {
  const { data, error } = await supabase
    .from('countdowns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Countdown;
}

export async function deleteCountdown(id: string): Promise<void> {
  const { error } = await supabase
    .from('countdowns')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function markCountdownComplete(id: string): Promise<Countdown> {
  const countdown = await getCountdownById(id);
  if (!countdown) throw new Error('Countdown not found');

  if (countdown.is_recurring && countdown.recurrence_type) {
    const currentTarget = parseISO(countdown.target_date);
    let nextTarget: Date;

    switch (countdown.recurrence_type) {
      case 'daily':
        nextTarget = new Date(currentTarget);
        nextTarget.setDate(nextTarget.getDate() + 1);
        break;
      case 'weekly':
        nextTarget = new Date(currentTarget);
        nextTarget.setDate(nextTarget.getDate() + 7);
        break;
      case 'monthly':
        nextTarget = new Date(currentTarget);
        nextTarget.setMonth(nextTarget.getMonth() + 1);
        break;
      case 'yearly':
        nextTarget = new Date(currentTarget);
        nextTarget.setFullYear(nextTarget.getFullYear() + 1);
        break;
      default:
        nextTarget = new Date(currentTarget);
        nextTarget.setDate(nextTarget.getDate() + 1);
    }

    return await updateCountdown(id, {
      target_date: nextTarget.toISOString().split('T')[0],
      is_completed: false,
    });
  }

  return await updateCountdown(id, { is_completed: true });
}

export function calculateDaysRemaining(targetDate: string): {
  days_remaining: number;
  is_overdue: boolean;
  is_today: boolean;
} {
  const target = parseISO(targetDate);
  const today = startOfDay(new Date());
  const targetDay = startOfDay(target);

  const days_remaining = differenceInDays(targetDay, today);
  const is_today = isSameDay(targetDay, today);
  const is_overdue = isBefore(targetDay, today) && !is_today;

  return {
    days_remaining: is_overdue ? Math.abs(days_remaining) : days_remaining,
    is_overdue,
    is_today,
  };
}

export async function getCountdownsWithDaysRemaining(): Promise<CountdownWithDaysRemaining[]> {
  const countdowns = await getCountdowns();

  return countdowns.map(countdown => ({
    ...countdown,
    ...calculateDaysRemaining(countdown.target_date),
  }));
}
