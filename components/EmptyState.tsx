import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '~/store/useTheme';

interface EmptyStateProps {
	message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
	const { colors } = useTheme();

	return (
		<View style={styles.container}>
			<Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
	},
	text: {
		fontSize: 16,
	},
});
