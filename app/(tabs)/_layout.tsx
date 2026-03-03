import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useTheme } from '~/store/useTheme';

export default function TabLayout() {
	const { colors } = useTheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.textSecondary,
				tabBarStyle: {
					backgroundColor: colors.background,
					borderTopColor: colors.textSecondary,
				},
				headerStyle: {
					backgroundColor: colors.background,
				},
				headerTintColor: colors.text,
			}}
		>
			<Tabs.Screen
				name="habits"
				options={{
					title: 'Habits',
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons name={focused ? 'checkbox' : 'checkbox-outline'} size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="countdowns"
				options={{
					title: 'Countdowns',
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
