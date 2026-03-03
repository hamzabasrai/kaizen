import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { calculateHabitStats } from '~/services/habits';
import { useTheme } from '~/store/useTheme';
import { Habit, HabitCompletion } from '~/types/habit';
import { ContributionGrid } from './ContributionGrid';
import { StreakDisplay } from './StreakDisplay';

interface HabitCardProps {
	habit: Habit;
	completions: HabitCompletion[];
	onPress?: () => void;
}

export const HabitCard = React.memo(function HabitCard({ habit, completions, onPress }: HabitCardProps) {
	const { colors } = useTheme();

	const stats = React.useMemo(() => {
		const s = calculateHabitStats(completions);
		return {
			currentStreak: s.current_streak,
			longestStreak: s.longest_streak,
			completionRate: s.completion_rate,
		};
	}, [completions]);

	return (
		<TouchableOpacity
			style={[styles.card, { backgroundColor: colors.surface }]}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<View style={styles.header}>
				<Text style={styles.icon}>{habit.icon || '✓'}</Text>
				<View style={styles.titleContainer}>
					<Text style={[styles.name, { color: colors.text }]}>
						{habit.name}
					</Text>
					<Text style={[styles.frequency, { color: colors.textSecondary }]}>
						{habit.frequency_goal}x per {habit.frequency_period}
					</Text>
				</View>
			</View>

			<ContributionGrid
				completions={completions
					.filter(
						(c): c is HabitCompletion & { completed: boolean } =>
							c.completed !== null,
					)
					.map(c => ({ date: c.date, completed: c.completed }))}
				color={habit.color || '#39d353'}
				onPress={onPress}
			/>

			<StreakDisplay
				currentStreak={stats.currentStreak}
				longestStreak={stats.longestStreak}
				completionRate={stats.completionRate}
			/>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	card: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	icon: {
		fontSize: 28,
		marginRight: 12,
	},
	titleContainer: {
		flex: 1,
	},
	name: {
		fontSize: 17,
		fontWeight: '600',
		marginBottom: 2,
	},
	frequency: {
		fontSize: 13,
	},
});
