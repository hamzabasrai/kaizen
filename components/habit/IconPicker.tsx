import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '~/store/useTheme';

const PRESET_ICONS = [
	'💪', '📖', '🏃', '💧', '🧘', '✍️', '🎵', '😴',
	'🥗', '💊', '🧹', '🌱', '🎯', '⏰', '🧠', '❤️',
];

interface IconPickerProps {
	selected: string | null;
	onSelect: (icon: string) => void;
}

export function IconPicker({ selected, onSelect }: IconPickerProps) {
	const { colors } = useTheme();

	return (
		<View style={styles.row}>
			{PRESET_ICONS.map(icon => {
				const isSelected = selected === icon;
				return (
					<TouchableOpacity
						key={icon}
						style={[
							styles.cell,
							{ backgroundColor: isSelected ? `${colors.primary}20` : colors.surface },
						]}
						onPress={() => onSelect(icon)}
						accessibilityLabel={`Icon ${icon}`}
					>
						<Text style={styles.emoji}>{icon}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	cell: {
		width: 44,
		height: 44,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emoji: {
		fontSize: 22,
	},
});
