import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as countdownService from '~/services/countdowns';
import { Countdown, CountdownWithDaysRemaining } from '~/types/countdown';
import { withAsync } from './helpers';

interface CountdownsState {
	countdowns: CountdownWithDaysRemaining[];
	currentCountdown: Countdown | null;
	loadingCount: number;
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
			error: null,

			fetchCountdowns: () =>
				withAsync(set, 'Failed to fetch countdowns', async () => {
					const countdowns =
						await countdownService.getCountdownsWithDaysRemaining();
					return { countdowns };
				}),

			fetchCountdown: (id: string) =>
				withAsync(set, 'Failed to fetch countdown', async () => {
					const countdown = await countdownService.getCountdownById(id);
					return { currentCountdown: countdown };
				}),

			createCountdown: countdown =>
				withAsync(set, 'Failed to create countdown', async () => {
					await countdownService.createCountdown(countdown);
					const countdowns =
						await countdownService.getCountdownsWithDaysRemaining();
					return { countdowns };
				}),

			updateCountdown: (id, updates) =>
				withAsync(set, 'Failed to update countdown', async () => {
					const updatedCountdown = await countdownService.updateCountdown(
						id,
						updates,
					);
					const { countdowns, currentCountdown } = get();
					return {
						countdowns: countdowns.map(c =>
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
							currentCountdown?.id === id
								? updatedCountdown
								: currentCountdown,
					};
				}),

			deleteCountdown: id =>
				withAsync(set, 'Failed to delete countdown', async () => {
					await countdownService.deleteCountdown(id);
					const { countdowns, currentCountdown } = get();
					return {
						countdowns: countdowns.filter(c => c.id !== id),
						currentCountdown:
							currentCountdown?.id === id ? null : currentCountdown,
					};
				}),

			markComplete: id =>
				withAsync(set, 'Failed to mark countdown complete', async () => {
					await countdownService.markCountdownComplete(id);
					const countdowns =
						await countdownService.getCountdownsWithDaysRemaining();
					return { countdowns };
				}),

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
