import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
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
import { authStyles } from '~/styles/auth';

export default function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const passwordRef = useRef<TextInput>(null);
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
			style={[authStyles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
		>
			<View style={authStyles.header}>
				<Text style={[authStyles.title, { color: isDark ? '#fff' : '#000' }]}>
					Welcome to Kaizen
				</Text>
				<Text style={[authStyles.subtitle, { color: isDark ? '#888' : '#666' }]}>
					Track your habits and countdowns
				</Text>
			</View>

			{error ? (
				<View style={authStyles.errorContainer}>
					<Ionicons name="alert-circle" size={20} color="#FF3B30" />
					<Text style={authStyles.errorText}>{error}</Text>
				</View>
			) : null}

			<View style={authStyles.form}>
				<TextInput
					style={[
						authStyles.input,
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
					returnKeyType="next"
					onSubmitEditing={() => passwordRef.current?.focus()}
				/>

				<TextInput
					ref={passwordRef}
					style={[
						authStyles.input,
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
					returnKeyType="done"
					onSubmitEditing={handleLogin}
				/>

				<TouchableOpacity
					style={[authStyles.button, authStyles.primaryButton]}
					onPress={handleLogin}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={authStyles.buttonText}>Sign In</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						authStyles.button,
						styles.anonymousButton,
						{ backgroundColor: isDark ? '#2c2c2e' : '#e5e5e5' },
					]}
					onPress={handleAnonymousLogin}
					disabled={isLoading}
				>
					<Text
						style={[authStyles.buttonText, { color: isDark ? '#fff' : '#000' }]}
					>
						Continue Anonymously
					</Text>
				</TouchableOpacity>
			</View>

			<View style={authStyles.footer}>
				<Text style={{ color: isDark ? '#888' : '#666' }}>
					Don&apos;t have an account?{' '}
				</Text>
				<Link href="/(auth)/signup" asChild>
					<TouchableOpacity>
						<Text style={authStyles.linkText}>Sign Up</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	anonymousButton: {
		marginTop: 8,
	},
});
