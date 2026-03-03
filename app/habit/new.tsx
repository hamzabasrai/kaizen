import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '~/store/useTheme';

export default function NewHabitScreen() {
	const { isDark } = useTheme();
	const router = useRouter();

	return (
		<View
			style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
		>
			<TouchableOpacity
				style={styles.closeButton}
				onPress={() => router.back()}
			>
				<Ionicons name="close" size={28} color={isDark ? '#fff' : '#000'} />
			</TouchableOpacity>
			<Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
				New Habit
			</Text>
			<Text style={[styles.subtitle, { color: isDark ? '#888' : '#666' }]}>
				Habit creation form coming soon...
			</Text>
		</View>
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
	},
});
