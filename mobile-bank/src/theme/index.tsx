import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';

export interface AppTheme {
  mode: ColorSchemeName | 'system';
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    muted: string;
    accent: string;
    danger: string;
    success: string;
    border: string;
    shadow: string;
  };
}

const lightColors: AppTheme['colors'] = {
  background: '#f5f7fb',
  surface: '#ffffff',
  card: '#0f172a',
  text: '#0f172a',
  muted: '#64748b',
  accent: '#6b5bff',
  danger: '#ef4444',
  success: '#22c55e',
  border: '#e2e8f0',
  shadow: 'rgba(15, 23, 42, 0.1)',
};

const darkColors: AppTheme['colors'] = {
  background: '#050b18',
  surface: '#0f172a',
  card: '#1f2a44',
  text: '#f8fafc',
  muted: '#94a3b8',
  accent: '#8b7bff',
  danger: '#f87171',
  success: '#4ade80',
  border: '#1e293b',
  shadow: 'rgba(0, 0, 0, 0.35)',
};

const THEME_PERSISTENCE_KEY = 'mobile-bank.theme';

interface ThemeContextValue {
  theme: AppTheme;
  navTheme: NavigationTheme;
  isDark: boolean;
  setThemeMode: (mode: AppTheme['mode']) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState<AppTheme['mode']>('system');

  const resolveMode = mode === 'system' ? systemScheme ?? 'light' : mode;

  const colors = resolveMode === 'dark' ? darkColors : lightColors;

  const theme = useMemo<AppTheme>(() => ({ mode, colors }), [colors, mode]);

  const navTheme: NavigationTheme = useMemo(
    () => ({
      ...(resolveMode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme),
      colors: {
        ...(resolveMode === 'dark' ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        primary: colors.accent,
      },
    }),
    [colors, resolveMode],
  );

  const setThemeMode = useCallback(async (nextMode: AppTheme['mode']) => {
    const normalizedMode = nextMode ?? 'system';
    setMode(normalizedMode);
    await AsyncStorage.setItem(THEME_PERSISTENCE_KEY, normalizedMode);
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem(THEME_PERSISTENCE_KEY).then(saved => {
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        setMode(saved);
      }
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, navTheme, isDark: resolveMode === 'dark', setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
