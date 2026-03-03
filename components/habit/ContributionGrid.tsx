import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '~/store/useTheme';

interface ContributionGridProps {
	completions: { date: string; completed: boolean }[];
	color?: string;
	onPress?: () => void;
}

const GRID_DAYS = 365;

export const ContributionGrid = React.memo(function ContributionGrid({
	completions,
	color = '#39d353',
	onPress,
}: ContributionGridProps) {
	const { colors } = useTheme();

	// Generate last 365 days
	const days = React.useMemo(() => {
		const today = new Date();
		const daysArray: string[] = [];
		for (let i = GRID_DAYS - 1; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			daysArray.push(date.toISOString().split('T')[0]);
		}
		return daysArray;
	}, []);

	const completedDates = React.useMemo(
		() => new Set(completions.filter(c => c.completed).map(c => c.date)),
		[completions],
	);

	const getLevel = (date: string) => {
		return completedDates.has(date) ? 4 : 0;
	};

	// Group into weeks (columns)
	const weeks = React.useMemo(() => {
		const weekColumns: string[][] = [];
		for (let i = 0; i < days.length; i += 7) {
			weekColumns.push(days.slice(i, i + 7));
		}
		return weekColumns;
	}, [days]);

	const getCellColor = (level: number) => {
		if (level === 0) return colors.gridEmpty;
		return color;
	};

	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.8}>
			<View style={styles.container}>
				{weeks.map((week, weekIndex) => (
					<View key={weekIndex} style={styles.weekColumn}>
						{week.map((date, dayIndex) => {
							const level = getLevel(date);
							return (
								<View
									key={`${weekIndex}-${dayIndex}`}
									style={[styles.cell, { backgroundColor: getCellColor(level) }]}
								/>
							);
						})}
					</View>
				))}
			</View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 2,
	},
	weekColumn: {
		gap: 2,
	},
	cell: {
		width: 8,
		height: 8,
		borderRadius: 1,
	},
});
