import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { useThemeStore } from './useThemeStore';

export function useTheme() {
  const colorScheme = useColorScheme();
  const { setSystemTheme, isDarkMode } = useThemeStore();

  useEffect(() => {
    setSystemTheme(colorScheme === 'dark');
  }, [colorScheme, setSystemTheme]);

  return {
    isDark: isDarkMode(),
  };
}
