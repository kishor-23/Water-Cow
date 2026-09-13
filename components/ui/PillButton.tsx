import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme, BorderRadius, Typography, Spacing } from '../../constants/theme';

interface PillButtonProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function PillButton({ label, selected = false, onPress, size = 'md' }: PillButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.pill,
        sizeStyles[size],
        selected 
          ? { backgroundColor: colors.primary, borderColor: colors.primary } 
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          sizeLabelStyles[size],
          selected ? { color: colors.textOnPrimary } : { color: colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
  },
});

const sizeStyles: Record<string, object> = {
  sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  lg: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
};

const sizeLabelStyles: Record<string, object> = {
  sm: { fontSize: Typography.size.sm },
  md: { fontSize: Typography.size.md },
  lg: { fontSize: Typography.size.lg },
};
