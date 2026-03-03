import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '~/store/useTheme';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface DayOfWeekPickerProps {
	selected: number[];
	onToggle: (day: number) => void;
}

export function DayOfWeekPicker({ selected, onToggle }: DayOfWeekPickerProps) {
	const { colors } = useTheme();

	return (
		<View style={styles.row}>
			{DAY_LABELS.map((label, index) => {
				const isSelected = selected.includes(index);
				return (
					<TouchableOpacity
						key={index}
						style={[
							styles.circle,
							{
								backgroundColor: isSelected ? colors.primary : colors.surface,
							},
						]}
						onPress={() => onToggle(index)}
						accessibilityLabel={`${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index]}`}
					>
						<Text
							style={[
								styles.label,
								{ color: isSelected ? '#fff' : colors.text },
							]}
						>
							{label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		gap: 8,
	},
	circle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
	},
});
