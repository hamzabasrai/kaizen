import { Ionicons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FABProps {
	href: Href;
	label: string;
}

export function FAB({ href, label }: FABProps) {
	return (
		<Link href={href} asChild>
			<TouchableOpacity style={styles.fab} accessibilityLabel={label}>
				<Ionicons name="add" size={32} color="#fff" />
			</TouchableOpacity>
		</Link>
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
		backgroundColor: '#007AFF',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});
