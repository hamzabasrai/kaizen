import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as habitService from '~/services/habits';
import { Habit, HabitCompletion, HabitWithStats } from '~/types/habit';

interface HabitsState {
	habits: Habit[];
	currentHabit: HabitWithStats | null;
	completions: Record<string, HabitCompletion[]>;
	isLoading: boolean;
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
}

export const useHabitsStore = create<HabitsState>()(
	persist(
		(set, get) => ({
			habits: [],
			currentHabit: null,
			completions: {},
			isLoading: false,
			error: null,

			fetchHabits: async () => {
				set({ isLoading: true, error: null });
				try {
					const habits = await habitService.getHabits();
					set({ habits, isLoading: false });
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to fetch habits',
						isLoading: false,
					});
				}
			},

			fetchHabit: async (id: string) => {
				set({ isLoading: true, error: null });
				try {
					const habit = await habitService.getHabitWithStats(id);
					set({ currentHabit: habit, isLoading: false });
				} catch (err) {
					set({
						error: err instanceof Error ? err.message : 'Failed to fetch habit',
						isLoading: false,
					});
				}
			},

			createHabit: async habit => {
				set({ isLoading: true, error: null });
				try {
					const newHabit = await habitService.createHabit(habit);
					set(state => ({
						habits: [newHabit, ...state.habits],
						isLoading: false,
					}));
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to create habit',
						isLoading: false,
					});
				}
			},

			updateHabit: async (id, updates) => {
				set({ isLoading: true, error: null });
				try {
					const updatedHabit = await habitService.updateHabit(id, updates);
					set(state => ({
						habits: state.habits.map(h => (h.id === id ? updatedHabit : h)),
						currentHabit:
							state.currentHabit?.id === id
								? { ...state.currentHabit, ...updatedHabit }
								: state.currentHabit,
						isLoading: false,
					}));
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to update habit',
						isLoading: false,
					});
				}
			},

			deleteHabit: async id => {
				set({ isLoading: true, error: null });
				try {
					await habitService.deleteHabit(id);
					set(state => ({
						habits: state.habits.filter(h => h.id !== id),
						currentHabit:
							state.currentHabit?.id === id ? null : state.currentHabit,
						isLoading: false,
					}));
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to delete habit',
						isLoading: false,
					});
				}
			},

			toggleCompletion: async (habitId, userId, date, completed) => {
				try {
					await habitService.toggleHabitCompletion(
						habitId,
						userId,
						date,
						completed,
					);
					// Refresh current habit stats if viewing it
					const { currentHabit } = get();
					if (currentHabit?.id === habitId) {
						await get().fetchHabit(habitId);
					}
				} catch (err) {
					set({
						error:
							err instanceof Error
								? err.message
								: 'Failed to toggle completion',
					});
				}
			},

			clearError: () => set({ error: null }),
		}),
		{
			name: 'habits-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({ habits: state.habits }),
		},
	),
);
