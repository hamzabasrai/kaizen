import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '~/store/useTheme';

const PRESET_COLORS = ['#FF3B30', '#FF9500', '#FFD60A', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#8E8E93'];

interface ColorPickerProps {
	selected: string | null;
	onSelect: (color: string) => void;
}

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
	const { colors } = useTheme();

	return (
		<View style={styles.row}>
			{PRESET_COLORS.map(color => {
				const isSelected = selected === color;
				return (
					<TouchableOpacity
						key={color}
						style={[
							styles.circle,
							{ backgroundColor: color },
							isSelected && { borderColor: colors.text, borderWidth: 2.5 },
						]}
						onPress={() => onSelect(color)}
						accessibilityLabel={`Color ${color}`}
					>
						{isSelected && <Ionicons name="checkmark" size={18} color="#fff" />}
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
		gap: 12,
	},
	circle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
