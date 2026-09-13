/**
 * Card — Frosted glass card with subtle shadow and rounded corners.
 */
import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme, BorderRadius, Shadows, Spacing } from '../../constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'frosted' | 'blue';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const { colors } = useTheme();

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.surface,
    },
    frosted: {
      backgroundColor: colors.surfaceFrosted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    blue: {
      backgroundColor: colors.surfaceBlue,
    },
  };

  return (
    <View style={[styles.card, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
});
