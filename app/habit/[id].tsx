import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '~/store/useTheme';

export default function HabitDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { isDark } = useTheme();
	const router = useRouter();

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
		>
			<TouchableOpacity
				style={styles.closeButton}
				onPress={() => router.back()}
			>
				<Ionicons name="close" size={28} color={isDark ? '#fff' : '#000'} />
			</TouchableOpacity>
			<Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
				Habit Detail
			</Text>
			<Text style={[styles.subtitle, { color: isDark ? '#888' : '#666' }]}>
				Habit ID: {id}
			</Text>
			<Text style={[styles.text, { color: isDark ? '#888' : '#666' }]}>
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
