import { StyleSheet } from 'react-native';
import { shared } from '~/store/useTheme';

export const authStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
	},
	header: {
		alignItems: 'center',
		marginBottom: 48,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
	},
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: `${shared.error}20`,
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	errorText: {
		color: shared.error,
		fontSize: 14,
		flex: 1,
	},
	form: {
		gap: 16,
	},
	input: {
		height: 48,
		borderRadius: 8,
		paddingHorizontal: 16,
		fontSize: 16,
	},
	button: {
		height: 48,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	primaryButton: {
		backgroundColor: shared.primary,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 32,
	},
	linkText: {
		color: shared.primary,
		fontWeight: '600',
	},
});
