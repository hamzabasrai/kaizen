import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState } from '~/components/EmptyState';
import { FAB } from '~/components/FAB';
import { HabitCard } from '~/components/habit/HabitCard';
import * as habitService from '~/services/habits';
import { useHabitsStore } from '~/store/useHabitsStore';
import { useTheme } from '~/store/useTheme';
import { Habit, HabitCompletion } from '~/types/habit';

interface HabitWithCompletions extends Habit {
	completions: HabitCompletion[];
}

export default function HabitsScreen() {
	const { habits, fetchHabits, loadingCount } = useHabitsStore();
	const isLoading = loadingCount > 0;
	const { colors } = useTheme();
	const [habitsWithCompletions, setHabitsWithCompletions] = useState<
		HabitWithCompletions[]
	>([]);

	const loadCompletions = useCallback(async () => {
		if (habits.length === 0) {
			setHabitsWithCompletions([]);
			return;
		}
		try {
			const completionsMap = await habitService.getAllCompletions(
				habits.map(h => h.id),
			);
			setHabitsWithCompletions(
				habits.map(habit => ({
					...habit,
					completions: completionsMap[habit.id] || [],
				})),
			);
		} catch {
			// Completions fetch failed — keep showing habits without completions
			setHabitsWithCompletions(
				habits.map(habit => ({ ...habit, completions: [] })),
			);
		}
	}, [habits]);

	useEffect(() => {
		fetchHabits();
	}, [fetchHabits]);

	useEffect(() => {
		loadCompletions();
	}, [habits, loadCompletions]);

	const renderHabit = ({ item }: { item: HabitWithCompletions }) => (
		<Link href={`/habit/${item.id}`} asChild>
			<HabitCard habit={item} completions={item.completions} />
		</Link>
	);

	return (
		<View
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<FlatList
				data={habitsWithCompletions}
				renderItem={renderHabit}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.list}
				refreshing={isLoading}
				onRefresh={fetchHabits}
				ListEmptyComponent={
					isLoading ? null : (
						<EmptyState message="No habits yet. Add your first habit!" />
					)
				}
			/>
			<FAB href="/habit/new" label="Add new habit" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	list: {
		padding: 16,
	},
});
