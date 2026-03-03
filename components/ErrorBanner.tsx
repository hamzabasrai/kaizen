import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { shared } from '~/store/useTheme';
import { authStyles } from '~/styles/auth';

interface ErrorBannerProps {
	message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
	if (!message) return null;

	return (
		<View style={authStyles.errorContainer}>
			<Ionicons name="alert-circle" size={20} color={shared.error} />
			<Text style={authStyles.errorText}>{message}</Text>
		</View>
	);
}
