import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import * as habitService from '~/services/habits';
import { Habit, HabitCompletion, HabitWithStats } from '~/types/habit';

import { withAsync } from './helpers';

interface HabitsState {
	habits: Habit[];
	currentHabit: HabitWithStats | null;
	completions: Record<string, HabitCompletion[]>;
	loadingCount: number;
	error: string | null;

	// Actions
	fetchHabits: () => Promise<void>;
	fetchHabit: (id: string) => Promise<void>;
	createHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
	updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
	deleteHabit: (id: string) => Promise<void>;
	toggleCompletion: (habitId: string, date: string, completed: boolean) => Promise<void>;
	clearError: () => void;
	reset: () => void;
}

export const useHabitsStore = create<HabitsState>()(
	persist(
		(set, get) => ({
			habits: [],
			currentHabit: null,
			completions: {},
			loadingCount: 0,
			error: null,

			fetchHabits: () =>
				withAsync(set, 'Failed to fetch habits', async () => {
					const habits = await habitService.getHabits();
					return { habits };
				}),

			fetchHabit: (id: string) =>
				withAsync(set, 'Failed to fetch habit', async () => {
					const habit = await habitService.getHabitWithStats(id);
					return { currentHabit: habit };
				}),

			createHabit: habit =>
				withAsync(set, 'Failed to create habit', async () => {
					const newHabit = await habitService.createHabit(habit);
					return { habits: [newHabit, ...get().habits] };
				}),

			updateHabit: (id, updates) =>
				withAsync(set, 'Failed to update habit', async () => {
					const updatedHabit = await habitService.updateHabit(id, updates);
					const { habits, currentHabit } = get();
					return {
						habits: habits.map(h => (h.id === id ? updatedHabit : h)),
						currentHabit: currentHabit?.id === id ? { ...currentHabit, ...updatedHabit } : currentHabit,
					};
				}),

			deleteHabit: id =>
				withAsync(set, 'Failed to delete habit', async () => {
					await habitService.deleteHabit(id);
					const { habits, currentHabit } = get();
					return {
						habits: habits.filter(h => h.id !== id),
						currentHabit: currentHabit?.id === id ? null : currentHabit,
					};
				}),

			toggleCompletion: async (habitId, date, completed) => {
				const prevCompletions = { ...get().completions };

				// Optimistic update
				set(s => {
					const habitCompletions = s.completions[habitId] || [];
					const updatedCompletions = completed
						? [
								...habitCompletions,
								{
									id: `temp-${date}`,
									habit_id: habitId,
									user_id: 'pending',
									date,
									completed: true,
									created_at: new Date().toISOString(),
								},
							]
						: habitCompletions.filter(c => c.date !== date);
					return {
						completions: {
							...s.completions,
							[habitId]: updatedCompletions,
						},
					};
				});

				try {
					await habitService.toggleHabitCompletion(habitId, date, completed);
					const { currentHabit } = get();
					if (currentHabit?.id === habitId) {
						await get().fetchHabit(habitId);
					}
				} catch (err) {
					// Rollback on failure
					set({
						completions: prevCompletions,
						error: err instanceof Error ? err.message : 'Failed to toggle completion',
					});
				}
			},

			clearError: () => set({ error: null }),

			reset: () =>
				set({
					habits: [],
					currentHabit: null,
					completions: {},
					loadingCount: 0,
					error: null,
				}),
		}),
		{
			name: 'habits-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({
				habits: state.habits,
				completions: state.completions,
			}),
		},
	),
);
