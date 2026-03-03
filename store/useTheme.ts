import { useColorScheme } from 'react-native';
import { useEffect, useMemo } from 'react';
import { useThemeStore } from './useThemeStore';

const palette = {
  light: {
    background: '#fff',
    surface: '#f2f2f7',
    text: '#000',
    textSecondary: '#666',
    placeholder: '#999',
  },
  dark: {
    background: '#000',
    surface: '#2c2c2e',
    text: '#fff',
    textSecondary: '#888',
    placeholder: '#888',
  },
} as const;

export type ThemeColors = (typeof palette)['light'];

export function useTheme() {
  const colorScheme = useColorScheme();
  const { setSystemTheme, isDarkMode } = useThemeStore();

  useEffect(() => {
    setSystemTheme(colorScheme === 'dark');
  }, [colorScheme, setSystemTheme]);

  const isDark = isDarkMode();
  const colors = useMemo(() => palette[isDark ? 'dark' : 'light'], [isDark]);

  return { isDark, colors };
}
