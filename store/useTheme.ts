import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { UserSettings } from '~/types';

// --- Palette ---

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

// --- Store (internal) ---

interface ThemeState {
	settings: UserSettings;
	isSystemDark: boolean;

	setTheme: (theme: UserSettings['theme']) => void;
	setSystemTheme: (isDark: boolean) => void;
	toggleNotifications: () => void;
	updateSettings: (settings: Partial<UserSettings>) => void;
	isDarkMode: () => boolean;
}

const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			settings: {
				theme: 'system',
				notifications_enabled: true,
			},
			isSystemDark: false,

			setTheme: theme => {
				set(state => ({
					settings: { ...state.settings, theme },
				}));
			},

			setSystemTheme: isDark => {
				if (get().isSystemDark !== isDark) {
					set({ isSystemDark: isDark });
				}
			},

			toggleNotifications: () => {
				set(state => ({
					settings: {
						...state.settings,
						notifications_enabled: !state.settings.notifications_enabled,
					},
				}));
			},

			updateSettings: newSettings => {
				set(state => ({
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
		},
	),
);

// --- Hook (public API) ---

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

export { useThemeStore };
