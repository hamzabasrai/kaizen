import { Text } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { ModalScreen } from '~/components/ModalScreen';
import { useTheme } from '~/store/useTheme';

export default function CountdownDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme();

	return (
		<ModalScreen title="Countdown Detail" subtitle={`Countdown ID: ${id}`}>
			<Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>Detail view coming soon...</Text>
		</ModalScreen>
	);
}
