import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../store/useTheme';
import { View } from 'react-native';

export default function RootLayout() {
  const { isDark } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="habit/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="habit/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="countdown/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="countdown/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}
