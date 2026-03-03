import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { AuthProvider, useAuth } from '~/context/AuthContext';
import { useTheme } from '~/store/useTheme';

function ProtectedLayout() {
	const { isAuthenticated, isLoading } = useAuth();
	const segments = useSegments();
	const router = useRouter();
	const { isDark } = useTheme();

	useEffect(() => {
		if (isLoading) return;

		const inAuthGroup = segments[0] === '(auth)';

		if (!isAuthenticated && !inAuthGroup) {
			// Redirect to login if not authenticated and not in auth group
			router.replace('/(auth)/login');
		} else if (isAuthenticated && inAuthGroup) {
			// Redirect to habits if authenticated and in auth group
			router.replace('/(tabs)/habits');
		}
	}, [isAuthenticated, isLoading, router, segments]);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar style={isDark ? 'light' : 'dark'} />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(auth)" />
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="habit/new" options={{ presentation: 'modal' }} />
				<Stack.Screen name="habit/[id]" options={{ presentation: 'modal' }} />
				<Stack.Screen
					name="countdown/new"
					options={{ presentation: 'modal' }}
				/>
				<Stack.Screen
					name="countdown/[id]"
					options={{ presentation: 'modal' }}
				/>
			</Stack>
		</View>
	);
}

export default function RootLayout() {
	return (
		<ErrorBoundary>
			<AuthProvider>
				<ProtectedLayout />
			</AuthProvider>
		</ErrorBoundary>
	);
}
