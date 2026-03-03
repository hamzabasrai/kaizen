import { useState } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

import { ErrorBanner } from '~/components/ErrorBanner';
import { ColorPicker } from '~/components/habit/ColorPicker';
import { DayOfWeekPicker } from '~/components/habit/DayOfWeekPicker';
import { IconPicker } from '~/components/habit/IconPicker';
import { ModalScreen } from '~/components/ModalScreen';
import { ThemedTextInput } from '~/components/ThemedTextInput';
import { getErrorMessage } from '~/lib/validation';
import { useHabitsStore } from '~/store/useHabitsStore';
import { useTheme } from '~/store/useTheme';
import { authStyles } from '~/styles/auth';

type FrequencyPeriod = 'daily' | 'weekly' | 'monthly';
const FREQUENCY_OPTIONS: FrequencyPeriod[] = ['daily', 'weekly', 'monthly'];

function buildDefaultTime(hours: number, minutes: number): Date {
	const d = new Date();
	d.setHours(hours, minutes, 0, 0);
	return d;
}

export default function NewHabitScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const createHabit = useHabitsStore(s => s.createHabit);

	// Essential fields
	const [name, setName] = useState('');
	const [notes, setNotes] = useState('');
	const [color, setColor] = useState<string | null>(null);
	const [icon, setIcon] = useState<string | null>(null);

	// Advanced — frequency
	const [frequencyPeriod, setFrequencyPeriod] = useState<FrequencyPeriod>('daily');
	const [frequencyGoal, setFrequencyGoal] = useState('1');

	// Advanced — reminders
	const [reminderEnabled, setReminderEnabled] = useState(false);
	const [reminderTime, setReminderTime] = useState(() => buildDefaultTime(9, 0));
	const [reminderDays, setReminderDays] = useState<number[]>([1, 2, 3, 4, 5]);
	const [showTimePicker, setShowTimePicker] = useState(false);

	// UI state
	const [advancedExpanded, setAdvancedExpanded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleToggleDay = (day: number) => {
		setReminderDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()));
	};

	const handleSubmit = async () => {
		const trimmed = name.trim();
		if (!trimmed) {
			setError('Habit name is required.');
			return;
		}

		setError(null);
		setIsSubmitting(true);
		try {
			await createHabit({
				user_id: null,
				name: trimmed,
				notes: notes.trim() || null,
				color,
				icon,
				frequency_period: frequencyPeriod,
				frequency_goal: parseInt(frequencyGoal, 10) || 1,
				reminder_enabled: reminderEnabled,
				reminder_time: reminderEnabled ? format(reminderTime, 'HH:mm') : null,
				reminder_days: reminderEnabled ? reminderDays : null,
			});
			router.back();
		} catch (err) {
			setError(getErrorMessage(err, 'Failed to create habit'));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ModalScreen title="New Habit" align="top">
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={100}
			>
				<ScrollView
					style={styles.flex}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
					showsVerticalScrollIndicator={false}
				>
					<ErrorBanner message={error} />

					{/* --- Essential Section --- */}
					<Text style={[styles.label, { color: colors.text }]}>Name</Text>
					<ThemedTextInput placeholder="e.g. Morning run" value={name} onChangeText={setName} autoFocus />

					<Text style={[styles.label, { color: colors.text }]}>Notes</Text>
					<ThemedTextInput
						placeholder="Optional description..."
						value={notes}
						onChangeText={setNotes}
						multiline
						style={styles.notesInput}
					/>

					<Text style={[styles.label, { color: colors.text }]}>Color</Text>
					<ColorPicker selected={color} onSelect={setColor} />

					<Text style={[styles.label, { color: colors.text }]}>Icon</Text>
					<IconPicker selected={icon} onSelect={setIcon} />

					{/* --- Divider --- */}
					<View style={[styles.divider, { backgroundColor: colors.divider }]} />

					{/* --- Advanced Section (accordion) --- */}
					<TouchableOpacity style={styles.accordionHeader} onPress={() => setAdvancedExpanded(prev => !prev)}>
						<Text style={[styles.accordionTitle, { color: colors.text }]}>Advanced</Text>
						<Ionicons name={advancedExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
					</TouchableOpacity>

					{advancedExpanded && (
						<View style={styles.advancedContent}>
							{/* Frequency */}
							<Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
							<View style={styles.pillRow}>
								{FREQUENCY_OPTIONS.map(opt => {
									const isActive = frequencyPeriod === opt;
									return (
										<TouchableOpacity
											key={opt}
											style={[
												styles.pill,
												{
													backgroundColor: isActive ? colors.primary : colors.surface,
												},
											]}
											onPress={() => setFrequencyPeriod(opt)}
										>
											<Text style={[styles.pillText, { color: isActive ? '#fff' : colors.text }]}>
												{opt.charAt(0).toUpperCase() + opt.slice(1)}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>

							<View style={styles.goalRow}>
								<ThemedTextInput
									value={frequencyGoal}
									onChangeText={setFrequencyGoal}
									keyboardType="number-pad"
									style={styles.goalInput}
								/>
								<Text style={[styles.goalLabel, { color: colors.textSecondary }]}>
									times per {frequencyPeriod === 'daily' ? 'day' : frequencyPeriod === 'weekly' ? 'week' : 'month'}
								</Text>
							</View>

							{/* Reminders */}
							<View style={styles.reminderRow}>
								<Text style={[styles.label, { color: colors.text, marginBottom: 0 }]}>Reminders</Text>
								<Switch
									value={reminderEnabled}
									onValueChange={setReminderEnabled}
									trackColor={{ true: colors.primary }}
								/>
							</View>

							{reminderEnabled && (
								<View style={styles.reminderContent}>
									{Platform.OS === 'ios' ? (
										<DateTimePicker
											value={reminderTime}
											mode="time"
											display="spinner"
											onChange={(_, date) => date && setReminderTime(date)}
											style={styles.timePicker}
										/>
									) : (
										<>
											<TouchableOpacity
												style={[styles.timeButton, { backgroundColor: colors.surface }]}
												onPress={() => setShowTimePicker(true)}
											>
												<Ionicons name="time-outline" size={20} color={colors.text} />
												<Text style={[styles.timeText, { color: colors.text }]}>{format(reminderTime, 'hh:mm a')}</Text>
											</TouchableOpacity>
											{showTimePicker && (
												<DateTimePicker
													value={reminderTime}
													mode="time"
													onChange={(_, date) => {
														setShowTimePicker(false);
														if (date) setReminderTime(date);
													}}
												/>
											)}
										</>
									)}

									<Text style={[styles.label, { color: colors.text }]}>Repeat on</Text>
									<DayOfWeekPicker selected={reminderDays} onToggle={handleToggleDay} />
								</View>
							)}
						</View>
					)}

					{/* --- Submit --- */}
					<TouchableOpacity
						style={[authStyles.button, authStyles.primaryButton, styles.submitButton]}
						onPress={handleSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={authStyles.buttonText}>Create Habit</Text>
						)}
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</ModalScreen>
	);
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 40,
		gap: 12,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: -4,
	},
	notesInput: {
		height: 80,
		textAlignVertical: 'top',
		paddingTop: 12,
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		marginVertical: 8,
	},
	accordionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4,
	},
	accordionTitle: {
		fontSize: 16,
		fontWeight: '600',
	},
	advancedContent: {
		gap: 12,
	},
	pillRow: {
		flexDirection: 'row',
		gap: 8,
	},
	pill: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	pillText: {
		fontSize: 14,
		fontWeight: '500',
	},
	goalRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	goalInput: {
		width: 56,
		textAlign: 'center',
	},
	goalLabel: {
		fontSize: 14,
	},
	reminderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	reminderContent: {
		gap: 12,
	},
	timePicker: {
		height: 120,
		alignSelf: 'center',
	},
	timeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		padding: 12,
		borderRadius: 8,
	},
	timeText: {
		fontSize: 16,
	},
	submitButton: {
		marginTop: 8,
	},
});
