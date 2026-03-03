import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as habitService from '~/services/habits';
import { Habit, HabitCompletion, HabitWithStats } from '~/types/habit';

interface HabitsState {
	habits: Habit[];
	currentHabit: HabitWithStats | null;
	completions: Record<string, HabitCompletion[]>;
	loadingCount: number;
	error: string | null;

	// Actions
	fetchHabits: () => Promise<void>;
	fetchHabit: (id: string) => Promise<void>;
	createHabit: (
		habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>,
	) => Promise<void>;
	updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
	deleteHabit: (id: string) => Promise<void>;
	toggleCompletion: (
		habitId: string,
		userId: string,
		date: string,
		completed: boolean,
	) => Promise<void>;
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

			fetchHabits: async () => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					const habits = await habitService.getHabits();
					set(s => ({ habits, loadingCount: s.loadingCount - 1 }));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to fetch habits',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			fetchHabit: async (id: string) => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					const habit = await habitService.getHabitWithStats(id);
					set(s => ({ currentHabit: habit, loadingCount: s.loadingCount - 1 }));
				} catch (err) {
					set(s => ({
						error: err instanceof Error ? err.message : 'Failed to fetch habit',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			createHabit: async habit => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					const newHabit = await habitService.createHabit(habit);
					set(s => ({
						habits: [newHabit, ...s.habits],
						loadingCount: s.loadingCount - 1,
					}));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to create habit',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			updateHabit: async (id, updates) => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					const updatedHabit = await habitService.updateHabit(id, updates);
					set(s => ({
						habits: s.habits.map(h => (h.id === id ? updatedHabit : h)),
						currentHabit:
							s.currentHabit?.id === id
								? { ...s.currentHabit, ...updatedHabit }
								: s.currentHabit,
						loadingCount: s.loadingCount - 1,
					}));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to update habit',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			deleteHabit: async id => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					await habitService.deleteHabit(id);
					set(s => ({
						habits: s.habits.filter(h => h.id !== id),
						currentHabit:
							s.currentHabit?.id === id ? null : s.currentHabit,
						loadingCount: s.loadingCount - 1,
					}));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to delete habit',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			toggleCompletion: async (habitId, userId, date, completed) => {
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
									user_id: userId,
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
					await habitService.toggleHabitCompletion(
						habitId,
						userId,
						date,
						completed,
					);
					const { currentHabit } = get();
					if (currentHabit?.id === habitId) {
						await get().fetchHabit(habitId);
					}
				} catch (err) {
					// Rollback on failure
					set({
						completions: prevCompletions,
						error:
							err instanceof Error
								? err.message
								: 'Failed to toggle completion',
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
			partialize: state => ({ habits: state.habits }),
		},
	),
);
