import { requireUserId, supabase } from '~/lib/supabase';
import {
	Habit,
	HabitCompletion,
	HabitInsert,
	HabitUpdate,
	HabitWithStats,
} from '~/types/habit';

export async function getHabits(): Promise<Habit[]> {
	const userId = await requireUserId();
	const { data, error } = await supabase
		.from('habits')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return (data || []) as Habit[];
}

export async function getHabitById(id: string): Promise<Habit | null> {
	const userId = await requireUserId();
	const { data, error } = await supabase
		.from('habits')
		.select('*')
		.eq('id', id)
		.eq('user_id', userId)
		.single();

	if (error) throw error;
	return data as Habit | null;
}

export async function createHabit(habit: HabitInsert): Promise<Habit> {
	const userId = await requireUserId();
	const { data, error } = await supabase
		.from('habits')
		.insert({ ...habit, user_id: userId })
		.select()
		.single();

	if (error) throw error;
	return data as Habit;
}

export async function updateHabit(
	id: string,
	updates: HabitUpdate,
): Promise<Habit> {
	const userId = await requireUserId();
	const { data, error } = await supabase
		.from('habits')
		.update(updates)
		.eq('id', id)
		.eq('user_id', userId)
		.select()
		.single();

	if (error) throw error;
	return data as Habit;
}

export async function deleteHabit(id: string): Promise<void> {
	const userId = await requireUserId();
	const { error } = await supabase
		.from('habits')
		.delete()
		.eq('id', id)
		.eq('user_id', userId);

	if (error) throw error;
}

export async function getHabitCompletions(
	habitId: string,
): Promise<HabitCompletion[]> {
	const userId = await requireUserId();
	const { data, error } = await supabase
		.from('habit_completions')
		.select('*')
		.eq('habit_id', habitId)
		.eq('user_id', userId)
		.order('date', { ascending: false });

	if (error) throw error;
	return (data || []) as HabitCompletion[];
}

export async function getAllCompletions(
	habitIds: string[],
): Promise<Record<string, HabitCompletion[]>> {
	if (habitIds.length === 0) return {};

	const userId = await requireUserId();
	const { data, error } = await supabase
		.from('habit_completions')
		.select('*')
		.in('habit_id', habitIds)
		.eq('user_id', userId)
		.order('date', { ascending: false });

	if (error) throw error;

	const grouped: Record<string, HabitCompletion[]> = {};
	for (const id of habitIds) {
		grouped[id] = [];
	}
	for (const completion of (data || []) as HabitCompletion[]) {
		if (completion.habit_id) {
			(grouped[completion.habit_id] ??= []).push(completion);
		}
	}
	return grouped;
}

export async function getCompletionsForDateRange(
	habitId: string,
	startDate: string,
	endDate: string,
): Promise<HabitCompletion[]> {
	const userId = await requireUserId();
	const { data, error } = await supabase
		.from('habit_completions')
		.select('*')
		.eq('habit_id', habitId)
		.eq('user_id', userId)
		.gte('date', startDate)
		.lte('date', endDate)
		.order('date', { ascending: true });

	if (error) throw error;
	return (data || []) as HabitCompletion[];
}

export async function toggleHabitCompletion(
	habitId: string,
	userId: string,
	date: string,
	completed: boolean,
): Promise<HabitCompletion> {
	if (completed) {
		const { data, error } = await supabase
			.from('habit_completions')
			.upsert({
				habit_id: habitId,
				user_id: userId,
				date,
				completed: true,
			})
			.select()
			.single();

		if (error) throw error;
		return data as HabitCompletion;
	} else {
		const { error } = await supabase
			.from('habit_completions')
			.delete()
			.eq('habit_id', habitId)
			.eq('date', date);

		if (error) throw error;
		return {
			id: '',
			habit_id: habitId,
			user_id: userId,
			date,
			completed: false,
			created_at: new Date().toISOString(),
		};
	}
}

export async function getHabitWithStats(
	habitId: string,
): Promise<HabitWithStats> {
	const habit = await getHabitById(habitId);
	if (!habit) throw new Error('Habit not found');

	const completions = await getHabitCompletions(habitId);

	const stats = calculateHabitStats(completions);

	return {
		...habit,
		...stats,
		completions,
	};
}

export function calculateHabitStats(completions: HabitCompletion[]) {
	if (completions.length === 0) {
		return {
			current_streak: 0,
			longest_streak: 0,
			completion_rate: 0,
		};
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const sortedCompletions = [...completions]
		.filter(c => c.completed && new Date(c.date).getTime() <= today.getTime())
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	let currentStreak = 0;
	let longestStreak = 0;
	let tempStreak = 0;
	let prevDate: Date | null = null;

	for (const completion of sortedCompletions) {
		const completionDate = new Date(completion.date);
		completionDate.setHours(0, 0, 0, 0);

		if (!prevDate) {
			const daysDiff = Math.floor(
				(today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24),
			);
			if (daysDiff <= 1) {
				currentStreak = 1;
				tempStreak = 1;
			} else {
				tempStreak = 1;
			}
		} else {
			const daysDiff = Math.floor(
				(prevDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24),
			);
			if (daysDiff === 1) {
				tempStreak++;
				if (currentStreak === 0 && tempStreak > 0) {
					const daysSinceToday = Math.floor(
						(today.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
					);
					if (daysSinceToday <= 1) {
						currentStreak = tempStreak;
					}
				}
			} else {
				longestStreak = Math.max(longestStreak, tempStreak);
				tempStreak = 1;
			}
		}

		prevDate = completionDate;
	}

	longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

	const completionRate =
		completions.length > 0
			? Math.round((sortedCompletions.length / completions.length) * 100)
			: 0;

	return {
		current_streak: currentStreak,
		longest_streak: longestStreak,
		completion_rate: completionRate,
	};
}
