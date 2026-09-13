import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface SegmentedControlProps {
  options: string[];
  selected: number;
  onChange: (index: number) => void;
}

export function SegmentedControl({ options, selected, onChange }: SegmentedControlProps) {
  const { colors } = useTheme();
  const [width, setWidth] = React.useState(0);
  const segmentWidth = width > 0 ? (width - 6) / options.length : 0;

  const translateX = useSharedValue(0);

  React.useEffect(() => {
    if (segmentWidth > 0) {
      translateX.value = withTiming(selected * segmentWidth, { duration: 250 });
    }
  }, [selected, segmentWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: segmentWidth,
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surfaceBlue }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {segmentWidth > 0 && (
        <Animated.View style={[styles.indicator, indicatorStyle, { backgroundColor: colors.surface, shadowColor: colors.shadowColor }]} />
      )}
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[styles.segment, { flex: 1 }]}
          onPress={() => onChange(index)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.label,
              selected === index 
                ? { color: colors.textPrimary } 
                : { color: colors.textTertiary },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xl,
    padding: 3,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    borderRadius: BorderRadius.xl - 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segment: {
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
  },
});
