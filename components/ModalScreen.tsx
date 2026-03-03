import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '~/store/useTheme';

interface ModalScreenProps {
	title: string;
	subtitle?: string;
	children?: React.ReactNode;
}

export function ModalScreen({ title, subtitle, children }: ModalScreenProps) {
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
			<Text style={[styles.title, { color: colors.text }]}>{title}</Text>
			{subtitle && (
				<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
					{subtitle}
				</Text>
			)}
			{children}
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
	},
});
