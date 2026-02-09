import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/useTheme';

export default function TabLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDark ? '#888' : '#666',
        tabBarStyle: {
          backgroundColor: isDark ? '#1c1c1e' : '#fff',
          borderTopColor: isDark ? '#333' : '#e5e5e5',
        },
        headerStyle: {
          backgroundColor: isDark ? '#1c1c1e' : '#fff',
        },
        headerTintColor: isDark ? '#fff' : '#000',
      }}
    >
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'checkbox' : 'checkbox-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="countdowns"
        options={{
          title: 'Countdowns',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
