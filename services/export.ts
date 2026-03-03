import { supabase } from '~/lib/supabase';
import { HabitCompletion } from '~/types/habit';
import { getCountdowns } from './countdowns';
import { getHabitCompletions, getHabits } from './habits';

export interface ExportData {
	export_date: string;
	version: string;
	habits: Awaited<ReturnType<typeof getHabits>>;
	habit_completions: HabitCompletion[];
	countdowns: Awaited<ReturnType<typeof getCountdowns>>;
	profile: {
		settings: any;
	};
}

export async function exportAllData(userId: string): Promise<ExportData> {
	const habits = await getHabits();
	const countdowns = await getCountdowns();

	const habitCompletionsArrays = await Promise.all(
		habits.map(habit => getHabitCompletions(habit.id)),
	);

	const { data: profile } = await supabase
		.from('profiles')
		.select('settings')
		.eq('id', userId)
		.single();

	return {
		export_date: new Date().toISOString(),
		version: '1.0.0',
		habits,
		habit_completions: habitCompletionsArrays.flat(),
		countdowns,
		profile: {
			settings: (profile as any)?.settings || {},
		},
	};
}
