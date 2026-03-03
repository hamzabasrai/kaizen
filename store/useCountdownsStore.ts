import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as countdownService from '~/services/countdowns';
import { Countdown, CountdownWithDaysRemaining } from '~/types/countdown';

interface CountdownsState {
	countdowns: CountdownWithDaysRemaining[];
	currentCountdown: Countdown | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	fetchCountdowns: () => Promise<void>;
	fetchCountdown: (id: string) => Promise<void>;
	createCountdown: (
		countdown: Omit<Countdown, 'id' | 'created_at' | 'updated_at'>,
	) => Promise<void>;
	updateCountdown: (id: string, updates: Partial<Countdown>) => Promise<void>;
	deleteCountdown: (id: string) => Promise<void>;
	markComplete: (id: string) => Promise<void>;
	clearError: () => void;
}

export const useCountdownsStore = create<CountdownsState>()(
	persist(
		(set, get) => ({
			countdowns: [],
			currentCountdown: null,
			isLoading: false,
			error: null,

			fetchCountdowns: async () => {
				set({ isLoading: true, error: null });
				try {
					const countdowns =
						await countdownService.getCountdownsWithDaysRemaining();
					set({ countdowns, isLoading: false });
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to fetch countdowns',
						isLoading: false,
					});
				}
			},

			fetchCountdown: async (id: string) => {
				set({ isLoading: true, error: null });
				try {
					const countdown = await countdownService.getCountdownById(id);
					set({ currentCountdown: countdown, isLoading: false });
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to fetch countdown',
						isLoading: false,
					});
				}
			},

			createCountdown: async countdown => {
				set({ isLoading: true, error: null });
				try {
					await countdownService.createCountdown(countdown);
					await get().fetchCountdowns();
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to create countdown',
						isLoading: false,
					});
				}
			},

			updateCountdown: async (id, updates) => {
				set({ isLoading: true, error: null });
				try {
					const updatedCountdown = await countdownService.updateCountdown(
						id,
						updates,
					);
					set(state => ({
						countdowns: state.countdowns.map(c =>
							c.id === id
								? {
										...c,
										...updatedCountdown,
										...countdownService.calculateDaysRemaining(
											updatedCountdown.target_date,
										),
									}
								: c,
						),
						currentCountdown:
							state.currentCountdown?.id === id
								? updatedCountdown
								: state.currentCountdown,
						isLoading: false,
					}));
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to update countdown',
						isLoading: false,
					});
				}
			},

			deleteCountdown: async id => {
				set({ isLoading: true, error: null });
				try {
					await countdownService.deleteCountdown(id);
					set(state => ({
						countdowns: state.countdowns.filter(c => c.id !== id),
						currentCountdown:
							state.currentCountdown?.id === id ? null : state.currentCountdown,
						isLoading: false,
					}));
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : 'Failed to delete countdown',
						isLoading: false,
					});
				}
			},

			markComplete: async id => {
				set({ isLoading: true, error: null });
				try {
					await countdownService.markCountdownComplete(id);
					await get().fetchCountdowns();
				} catch (err) {
					set({
						error:
							err instanceof Error
								? err.message
								: 'Failed to mark countdown complete',
						isLoading: false,
					});
				}
			},

			clearError: () => set({ error: null }),
		}),
		{
			name: 'countdowns-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({ countdowns: state.countdowns }),
		},
	),
);
