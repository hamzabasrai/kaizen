import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
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
import { ThemedTextInput } from '~/components/ThemedTextInput';
import { useAuth } from '~/context/AuthContext';
import { useTheme } from '~/store/useTheme';
import { authStyles } from '~/styles/auth';

export default function SignupScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const passwordRef = useRef<TextInput>(null);
	const confirmPasswordRef = useRef<TextInput>(null);
	const { signUp, isLoading } = useAuth();
	const { colors } = useTheme();

	const handleSignup = async () => {
		const trimmedEmail = email.trim();
		if (!trimmedEmail || !password) {
			setError('Please enter both email and password');
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			setError('Please enter a valid email address');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}

		try {
			setError('');
			await signUp(trimmedEmail, password);
			setSuccess(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create account');
		}
	};

	if (success) {
		return (
			<SafeAreaView
				style={[
					authStyles.container,
					{ backgroundColor: colors.background },
				]}
			>
				<View style={styles.successContainer}>
					<Ionicons name="checkmark-circle" size={64} color="#34C759" />
					<Text
						style={[styles.successTitle, { color: colors.text }]}
					>
						Account Created!
					</Text>
					<Text
						style={[styles.successText, { color: colors.textSecondary }]}
					>
						Please check your email to confirm your account before signing in.
					</Text>
					<TouchableOpacity
						style={[authStyles.button, authStyles.primaryButton]}
						onPress={() => router.replace('/(auth)/login')}
					>
						<Text style={authStyles.buttonText}>Go to Login</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			style={[authStyles.container, { backgroundColor: colors.background }]}
		>
			<View style={authStyles.header}>
				<Text style={[authStyles.title, { color: colors.text }]}>
					Create Account
				</Text>
				<Text style={[authStyles.subtitle, { color: colors.textSecondary }]}>
					Start tracking your habits today
				</Text>
			</View>

			{error ? (
				<View style={authStyles.errorContainer}>
					<Ionicons name="alert-circle" size={20} color="#FF3B30" />
					<Text style={authStyles.errorText}>{error}</Text>
				</View>
			) : null}

			<View style={authStyles.form}>
				<ThemedTextInput
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
					editable={!isLoading}
					returnKeyType="next"
					onSubmitEditing={() => passwordRef.current?.focus()}
				/>

				<ThemedTextInput
					ref={passwordRef}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					editable={!isLoading}
					returnKeyType="next"
					onSubmitEditing={() => confirmPasswordRef.current?.focus()}
				/>

				<ThemedTextInput
					ref={confirmPasswordRef}
					placeholder="Confirm Password"
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry
					editable={!isLoading}
					returnKeyType="done"
					onSubmitEditing={handleSignup}
				/>

				<TouchableOpacity
					style={[authStyles.button, authStyles.primaryButton]}
					onPress={handleSignup}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={authStyles.buttonText}>Create Account</Text>
					)}
				</TouchableOpacity>
			</View>

			<View style={authStyles.footer}>
				<Text style={{ color: colors.textSecondary }}>
					Already have an account?{' '}
				</Text>
				<Link href="/(auth)/login" asChild>
					<TouchableOpacity>
						<Text style={authStyles.linkText}>Sign In</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	successContainer: {
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	successTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 24,
		marginBottom: 12,
	},
	successText: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 32,
	},
});
