import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '~/store/useTheme';

interface StreakDisplayProps {
	currentStreak: number;
	longestStreak: number;
	completionRate: number;
}

export const StreakDisplay = React.memo(function StreakDisplay({
	currentStreak,
	longestStreak,
	completionRate,
}: StreakDisplayProps) {
	const { colors } = useTheme();

	return (
		<View style={styles.container}>
			<View style={styles.stat}>
				<Ionicons name="flame" size={16} color="#FF9500" />
				<Text style={[styles.value, { color: colors.text }]}>
					{currentStreak}
				</Text>
				<Text style={[styles.label, { color: colors.textSecondary }]}>
					Current
				</Text>
			</View>

			<View style={styles.divider} />

			<View style={styles.stat}>
				<Ionicons name="trophy" size={16} color="#FFD60A" />
				<Text style={[styles.value, { color: colors.text }]}>
					{longestStreak}
				</Text>
				<Text style={[styles.label, { color: colors.textSecondary }]}>
					Best
				</Text>
			</View>

			<View style={styles.divider} />

			<View style={styles.stat}>
				<Ionicons name="checkmark-circle" size={16} color="#34C759" />
				<Text style={[styles.value, { color: colors.text }]}>
					{completionRate}%
				</Text>
				<Text style={[styles.label, { color: colors.textSecondary }]}>
					Rate
				</Text>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		marginTop: 12,
	},
	stat: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	value: {
		fontSize: 14,
		fontWeight: '600',
	},
	label: {
		fontSize: 12,
	},
	divider: {
		width: 1,
		height: 20,
		backgroundColor: '#e5e5e5',
		opacity: 0.5,
	},
});
