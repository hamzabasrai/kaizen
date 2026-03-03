import { Link } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmptyState } from '~/components/EmptyState';
import { FAB } from '~/components/FAB';
import { useCountdownsStore } from '~/store/useCountdownsStore';
import { useTheme } from '~/store/useTheme';

export default function CountdownsScreen() {
	const { countdowns, fetchCountdowns, loadingCount } = useCountdownsStore();
	const isLoading = loadingCount > 0;
	const { colors } = useTheme();

	useEffect(() => {
		fetchCountdowns();
	}, [fetchCountdowns]);

	const renderCountdown = ({ item }: { item: (typeof countdowns)[0] }) => {
		let daysText = '';
		let daysColor: string = colors.primary;

		if (item.is_today) {
			daysText = 'Today!';
			daysColor = colors.success;
		} else if (item.is_overdue) {
			daysText = `${item.days_remaining} days overdue`;
			daysColor = colors.error;
		} else {
			daysText = `${item.days_remaining} days left`;
		}

		return (
			<Link href={`/countdown/${item.id}`} asChild>
				<TouchableOpacity
					style={[
						styles.countdownCard,
						{ backgroundColor: colors.surface },
					]}
				>
					<View style={styles.countdownContent}>
						<Text style={styles.countdownIcon}>{item.icon || '📅'}</Text>
						<View style={styles.countdownInfo}>
							<Text
								style={[
									styles.countdownTitle,
									{ color: colors.text },
								]}
							>
								{item.title}
							</Text>
							<Text
								style={[
									styles.countdownDate,
									{ color: colors.textSecondary },
								]}
							>
								{item.target_date}
							</Text>
						</View>
						<Text style={[styles.daysRemaining, { color: daysColor }]}>
							{daysText}
						</Text>
					</View>
				</TouchableOpacity>
			</Link>
		);
	};

	return (
		<View
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<FlatList
				data={countdowns}
				renderItem={renderCountdown}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.list}
				refreshing={isLoading}
				onRefresh={fetchCountdowns}
				ListEmptyComponent={
					isLoading ? null : (
						<EmptyState message="No countdowns yet. Add your first countdown!" />
					)
				}
			/>
			<FAB href="/countdown/new" label="Add new countdown" />
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
	countdownCard: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	countdownContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	countdownIcon: {
		fontSize: 24,
		marginRight: 12,
	},
	countdownInfo: {
		flex: 1,
	},
	countdownTitle: {
		fontSize: 17,
		fontWeight: '600',
		marginBottom: 4,
	},
	countdownDate: {
		fontSize: 14,
	},
	daysRemaining: {
		fontSize: 16,
		fontWeight: '600',
	},
});
