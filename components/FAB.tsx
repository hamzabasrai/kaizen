import { StyleSheet, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';

import { useTheme } from '~/store/useTheme';

interface FABProps {
	href: Href;
	label: string;
}

export function FAB({ href, label }: FABProps) {
	const { colors } = useTheme();
	const router = useRouter();

	return (
		<TouchableOpacity
			style={[styles.fab, { backgroundColor: colors.primary }]}
			onPress={() => router.push(href)}
			accessibilityLabel={label}
		>
			<Ionicons name="add" size={32} color="#fff" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		right: 20,
		bottom: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});
