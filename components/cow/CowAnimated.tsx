/**
 * CowAnimated — Animated wrapper for the cow mascot.
 * Adds gentle idle bobbing and mood transition animations.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { CowMascot } from './CowMascot';
import { COW_MOODS, type CowMood } from '../../constants/cowMoods';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface CowAnimatedProps {
  mood: CowMood;
  size?: number;
  showMessage?: boolean;
}

export function CowAnimated({ mood, size = 160, showMessage = true }: CowAnimatedProps) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Gentle idle bobbing
  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Mood transition — gentle scale bounce
  useEffect(() => {
    scale.value = withSequence(
      withTiming(0.92, { duration: 150 }),
      withSpring(1, { damping: 8, stiffness: 120 })
    );
    opacity.value = withSequence(
      withTiming(0.7, { duration: 100 }),
      withTiming(1, { duration: 300 })
    );
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const moodConfig = COW_MOODS[mood];

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <CowMascot mood={mood} size={size} />
      </Animated.View>
      {showMessage && (
        <Text style={[styles.message, { color: moodConfig.color }]}>
          {moodConfig.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  message: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
});
