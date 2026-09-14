import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface StatsCardProps {
  icon: keyof typeof Feather.glyphMap;
  value: string;
  label: string;
  color?: string;
  onPress?: () => void;
}

export function StatsCard({ icon, value, label, color, onPress }: StatsCardProps) {
  const { colors } = useTheme();
  const activeColor = color || colors.primary;

  const content = (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: activeColor + '15' }]}>
        <Feather name={icon} size={18} color={activeColor} />
      </View>
      <Text
        style={[styles.value, { color: colors.textPrimary }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
      <Text
        style={[styles.label, { color: colors.textTertiary }]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={{ flex: 1 }}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.lg,
    marginBottom: 2,
  },
  label: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
  },
});
