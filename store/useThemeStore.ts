import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

interface ThemeState {
  settings: UserSettings;
  isSystemDark: boolean;
  
  // Actions
  setTheme: (theme: UserSettings['theme']) => void;
  setSystemTheme: (isDark: boolean) => void;
  toggleNotifications: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  isDarkMode: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      settings: {
        theme: 'system',
        notifications_enabled: true,
      },
      isSystemDark: false,

      setTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme },
        }));
      },

      setSystemTheme: (isDark) => {
        set({ isSystemDark: isDark });
      },

      toggleNotifications: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications_enabled: !state.settings.notifications_enabled,
          },
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      isDarkMode: () => {
        const { settings, isSystemDark } = get();
        if (settings.theme === 'system') {
          return isSystemDark;
        }
        return settings.theme === 'dark';
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
