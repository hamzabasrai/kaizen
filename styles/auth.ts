import { StyleSheet } from 'react-native';

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
		backgroundColor: '#FF3B3020',
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	errorText: {
		color: '#FF3B30',
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
		backgroundColor: '#007AFF',
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
		color: '#007AFF',
		fontWeight: '600',
	},
});
