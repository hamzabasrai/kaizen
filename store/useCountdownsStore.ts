import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as countdownService from '~/services/countdowns';
import { Countdown, CountdownWithDaysRemaining } from '~/types/countdown';

interface CountdownsState {
	countdowns: CountdownWithDaysRemaining[];
	currentCountdown: Countdown | null;
	loadingCount: number;
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
	reset: () => void;
}

export const useCountdownsStore = create<CountdownsState>()(
	persist(
		(set, get) => ({
			countdowns: [],
			currentCountdown: null,
			loadingCount: 0,
			get isLoading() {
				return get().loadingCount > 0;
			},
			error: null,

			fetchCountdowns: async () => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					const countdowns =
						await countdownService.getCountdownsWithDaysRemaining();
					set(s => ({ countdowns, loadingCount: s.loadingCount - 1 }));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to fetch countdowns',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			fetchCountdown: async (id: string) => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					const countdown = await countdownService.getCountdownById(id);
					set(s => ({ currentCountdown: countdown, loadingCount: s.loadingCount - 1 }));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to fetch countdown',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			createCountdown: async countdown => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					await countdownService.createCountdown(countdown);
					await get().fetchCountdowns();
					set(s => ({ loadingCount: s.loadingCount - 1 }));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to create countdown',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			updateCountdown: async (id, updates) => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					const updatedCountdown = await countdownService.updateCountdown(
						id,
						updates,
					);
					set(s => ({
						countdowns: s.countdowns.map(c =>
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
							s.currentCountdown?.id === id
								? updatedCountdown
								: s.currentCountdown,
						loadingCount: s.loadingCount - 1,
					}));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to update countdown',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			deleteCountdown: async id => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					await countdownService.deleteCountdown(id);
					set(s => ({
						countdowns: s.countdowns.filter(c => c.id !== id),
						currentCountdown:
							s.currentCountdown?.id === id ? null : s.currentCountdown,
						loadingCount: s.loadingCount - 1,
					}));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error ? err.message : 'Failed to delete countdown',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			markComplete: async id => {
				set(s => ({ loadingCount: s.loadingCount + 1, error: null }));
				try {
					await countdownService.markCountdownComplete(id);
					await get().fetchCountdowns();
					set(s => ({ loadingCount: s.loadingCount - 1 }));
				} catch (err) {
					set(s => ({
						error:
							err instanceof Error
								? err.message
								: 'Failed to mark countdown complete',
						loadingCount: s.loadingCount - 1,
					}));
				}
			},

			clearError: () => set({ error: null }),

			reset: () =>
				set({
					countdowns: [],
					currentCountdown: null,
					loadingCount: 0,
					error: null,
				}),
		}),
		{
			name: 'countdowns-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({ countdowns: state.countdowns }),
			onRehydrateStorage: () => state => {
				if (state?.countdowns) {
					state.countdowns = state.countdowns.map(c => ({
						...c,
						...countdownService.calculateDaysRemaining(c.target_date),
					}));
				}
			},
		},
	),
);
