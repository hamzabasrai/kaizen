import React from 'react';
import {
	Appearance,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	private handleReset = () => {
		this.setState({ hasError: false });
	};

	render() {
		if (this.state.hasError) {
			const isDark = Appearance.getColorScheme() === 'dark';
			const bg = isDark ? '#000' : '#fff';
			const text = isDark ? '#fff' : '#000';
			const textSecondary = isDark ? '#888' : '#666';

			return (
				<View
					style={[styles.container, { backgroundColor: bg }]}
				>
					<Text style={[styles.title, { color: text }]}>
						Something went wrong
					</Text>
					<Text
						style={[styles.subtitle, { color: textSecondary }]}
					>
						The app encountered an unexpected error.
					</Text>
					<TouchableOpacity style={styles.button} onPress={this.handleReset}>
						<Text style={styles.buttonText}>Try Again</Text>
					</TouchableOpacity>
				</View>
			);
		}

		return this.props.children;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 24,
	},
	button: {
		backgroundColor: '#007AFF',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
