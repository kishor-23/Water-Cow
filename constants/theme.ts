import { useColorScheme } from 'react-native';

export const Colors = {
  // Primary palette
  primary: '#4A9FD8',
  primaryLight: '#7BBDE8',
  primaryDark: '#2B7BB8',
  primaryGradientStart: '#5BB5E8',
  primaryGradientEnd: '#3A8FC8',

  // Background & surfaces
  background: '#F0F8FF',
  surface: '#FFFFFF',
  surfaceFrosted: 'rgba(255, 255, 255, 0.85)',
  surfaceBlue: '#E8F4FD',
  surfaceBlueDark: '#D4ECFA',

  // Text
  textPrimary: '#1A2B4A',
  textSecondary: '#5A6B8A',
  textTertiary: '#8A9BBB',
  textOnPrimary: '#FFFFFF',

  // Accents
  accent: '#2196F3',
  accentCyan: '#00BCD4',
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',

  // Cow-specific
  cowWhite: '#F5F0EB',
  cowBlack: '#2D2D2D',
  cowPink: '#FFB6C1',
  cowBell: '#FFD700',

  // Borders & dividers
  border: '#E0EBF5',
  divider: '#F0F4F8',

  // Shadows
  shadowColor: '#1A2B4A',

  // Tab bar
  tabBarBackground: 'rgba(255, 255, 255, 0.95)',
  tabBarBorder: '#E8F0F8',
  tabBarActive: '#4A9FD8',
  tabBarInactive: '#B0BEC5',
} as const;

export const Typography = {
  fontFamily: {
    light: 'Inter_300Light',
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  lineHeight: {
    xs: 16,
    sm: 18,
    md: 22,
    lg: 24,
    xl: 28,
    xxl: 32,
    xxxl: 40,
    display: 48,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  jumbo: 48,
  mega: 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const ProgressColors = {
  low: '#F44336',       // 0-25% — red
  medium: '#FF9800',    // 25-50% — orange
  good: '#4A9FD8',      // 50-75% — blue
  great: '#4CAF50',     // 75-100% — green
  complete: '#2E7D32',  // 100% — dark green
} as const;

export function getProgressColor(percentage: number): string {
  if (percentage >= 1) return ProgressColors.complete;
  if (percentage >= 0.75) return ProgressColors.great;
  if (percentage >= 0.5) return ProgressColors.good;
  if (percentage >= 0.25) return ProgressColors.medium;
  return ProgressColors.low;
}

export const DarkColors = {
  // Primary palette (remains vibrant blue)
  primary: '#4A9FD8',
  primaryLight: '#3A8FC8',
  primaryDark: '#7BBDE8',
  primaryGradientStart: '#3A8FC8',
  primaryGradientEnd: '#2B7BB8',

  // Background & surfaces (slate theme)
  background: '#0F172A',
  surface: '#1E293B',
  surfaceFrosted: 'rgba(30, 41, 59, 0.85)',
  surfaceBlue: '#1E293B',
  surfaceBlueDark: '#334155',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  textOnPrimary: '#FFFFFF',

  // Accents
  accent: '#3B82F6',
  accentCyan: '#06B6D4',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.1)',

  // Cow-specific (inverted colors for outline visibility)
  cowWhite: '#2D2D2D',
  cowBlack: '#F5F0EB',
  cowPink: '#FFB6C1',
  cowBell: '#FFD700',

  // Borders & dividers
  border: '#334155',
  divider: '#334155',

  // Shadows
  shadowColor: '#000000',

  // Tab bar
  tabBarBackground: '#1E293B',
  tabBarBorder: '#334155',
  tabBarActive: '#4A9FD8',
  tabBarInactive: '#64748B',
} as const;

export { useTheme, ThemeProvider, type ThemeMode } from '../context/ThemeContext';

