import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '~/store/useTheme';

interface StreakDisplayProps {
	currentStreak: number;
	longestStreak: number;
	completionRate: number;
}

export function StreakDisplay({
	currentStreak,
	longestStreak,
	completionRate,
}: StreakDisplayProps) {
	const { isDark } = useTheme();

	return (
		<View style={styles.container}>
			<View style={styles.stat}>
				<Ionicons name="flame" size={16} color="#FF9500" />
				<Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>
					{currentStreak}
				</Text>
				<Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>
					Current
				</Text>
			</View>

			<View style={styles.divider} />

			<View style={styles.stat}>
				<Ionicons name="trophy" size={16} color="#FFD60A" />
				<Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>
					{longestStreak}
				</Text>
				<Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>
					Best
				</Text>
			</View>

			<View style={styles.divider} />

			<View style={styles.stat}>
				<Ionicons name="checkmark-circle" size={16} color="#34C759" />
				<Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>
					{completionRate}%
				</Text>
				<Text style={[styles.label, { color: isDark ? '#888' : '#666' }]}>
					Rate
				</Text>
			</View>
		</View>
	);
}

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
