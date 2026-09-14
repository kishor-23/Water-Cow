/**
 * ThemeContext — Manages user theme preference (Light, Dark, System) and provides dynamic colors.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, DarkColors } from '../constants/theme';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeColors = typeof Colors | typeof DarkColors;

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
}

const THEME_STORAGE_KEY = 'watercow_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeModeState(saved as ThemeMode);
      }
    });
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const isDark = themeMode === 'dark';
  const colors = isDark ? DarkColors : Colors;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = colors.background;
      document.documentElement.style.backgroundColor = colors.background;
    }
  }, [colors.background]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      themeMode: 'light' as ThemeMode,
      setThemeMode: () => {},
      colors: Colors,
      isDark: false,
    };
  }
  return context;
}
