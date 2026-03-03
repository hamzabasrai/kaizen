import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '~/store/useTheme';

export default function CountdownDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme();
	const router = useRouter();

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<TouchableOpacity
				style={styles.closeButton}
				onPress={() => router.back()}
				accessibilityLabel="Close"
			>
				<Ionicons name="close" size={28} color={colors.text} />
			</TouchableOpacity>
			<Text style={[styles.title, { color: colors.text }]}>
				Countdown Detail
			</Text>
			<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
				Countdown ID: {id}
			</Text>
			<Text style={[styles.text, { color: colors.textSecondary }]}>
				Detail view coming soon...
			</Text>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	closeButton: {
		position: 'absolute',
		top: 16,
		right: 16,
		padding: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 8,
	},
	text: {
		fontSize: 14,
	},
});
