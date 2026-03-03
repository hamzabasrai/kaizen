import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '~/context/AuthContext';
import { useTheme } from '~/store/useTheme';

export default function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { signIn, signInAnonymously, isLoading } = useAuth();
	const { isDark } = useTheme();

	const handleLogin = async () => {
		const trimmedEmail = email.trim();
		if (!trimmedEmail || !password) {
			setError('Please enter both email and password');
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			setError('Please enter a valid email address');
			return;
		}

		try {
			setError('');
			await signIn(trimmedEmail, password);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to sign in');
		}
	};

	const handleAnonymousLogin = async () => {
		try {
			setError('');
			await signInAnonymously();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to sign in anonymously');
		}
	};

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
		>
			<View style={styles.header}>
				<Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
					Welcome to Kaizen
				</Text>
				<Text style={[styles.subtitle, { color: isDark ? '#888' : '#666' }]}>
					Track your habits and countdowns
				</Text>
			</View>

			{error ? (
				<View style={styles.errorContainer}>
					<Ionicons name="alert-circle" size={20} color="#FF3B30" />
					<Text style={styles.errorText}>{error}</Text>
				</View>
			) : null}

			<View style={styles.form}>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
							color: isDark ? '#fff' : '#000',
						},
					]}
					placeholder="Email"
					placeholderTextColor={isDark ? '#888' : '#999'}
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
					editable={!isLoading}
				/>

				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
							color: isDark ? '#fff' : '#000',
						},
					]}
					placeholder="Password"
					placeholderTextColor={isDark ? '#888' : '#999'}
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					editable={!isLoading}
				/>

				<TouchableOpacity
					style={[styles.button, styles.primaryButton]}
					onPress={handleLogin}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={styles.buttonText}>Sign In</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.button,
						styles.anonymousButton,
						{ backgroundColor: isDark ? '#2c2c2e' : '#e5e5e5' },
					]}
					onPress={handleAnonymousLogin}
					disabled={isLoading}
				>
					<Text
						style={[styles.buttonText, { color: isDark ? '#fff' : '#000' }]}
					>
						Continue Anonymously
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.footer}>
				<Text style={{ color: isDark ? '#888' : '#666' }}>
					Don&apos;t have an account?{' '}
				</Text>
				<Link href="/(auth)/signup" asChild>
					<TouchableOpacity>
						<Text style={styles.linkText}>Sign Up</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
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
	anonymousButton: {
		marginTop: 8,
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
