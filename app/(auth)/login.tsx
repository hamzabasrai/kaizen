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
	const { colors } = useTheme();

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
			style={[authStyles.container, { backgroundColor: colors.background }]}
		>
			<View style={authStyles.header}>
				<Text style={[authStyles.title, { color: colors.text }]}>
					Welcome to Kaizen
				</Text>
				<Text style={[authStyles.subtitle, { color: colors.textSecondary }]}>
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
							backgroundColor: colors.surface,
							color: colors.text,
						},
					]}
					placeholder="Email"
					placeholderTextColor={colors.placeholder}
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
							backgroundColor: colors.surface,
							color: colors.text,
						},
					]}
					placeholder="Password"
					placeholderTextColor={colors.placeholder}
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
						{ backgroundColor: colors.surface },
					]}
					onPress={handleAnonymousLogin}
					disabled={isLoading}
				>
					<Text
						style={[authStyles.buttonText, { color: colors.text }]}
					>
						Continue Anonymously
					</Text>
				</TouchableOpacity>
			</View>

			<View style={authStyles.footer}>
				<Text style={{ color: colors.textSecondary }}>
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
