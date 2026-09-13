import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
  FadeOut,
} from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface CustomLaunchScreenProps {
  onFinish?: () => void;
}

export function CustomLaunchScreen({ onFinish }: CustomLaunchScreenProps) {
  const { colors, isDark } = useTheme();

  // Animation values
  const floatY = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);
  const glowScale = useSharedValue(0.9);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Entrance fade-in and scale up
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.back(1.5)),
    });

    // Gentle vertical floating loop
    floatY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Soft background glow pulse
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.95, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Progress bar fill to 100% over 1.4s
    progressWidth.value = withTiming(
      1,
      { duration: 1400, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished && onFinish) {
          runOnJS(onFinish)();
        }
      }
    );
  }, []);

  // Animated styles
  const mascotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: opacity.value * 0.45,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <Animated.View
      exiting={FadeOut.duration(500)}
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0A1624' : '#EBF6FF' },
      ]}
    >
      {/* Background Soft Ambient Light */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            backgroundColor: isDark ? 'rgba(74, 159, 216, 0.25)' : 'rgba(74, 159, 216, 0.35)',
          },
          glowAnimatedStyle,
        ]}
      />

      {/* Main Mascot Card Container */}
      <Animated.View style={[styles.contentCard, mascotAnimatedStyle]}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/waterCowWithGlass.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Branding & App Title */}
        <Text style={[styles.appTitle, { color: colors.textPrimary }]}>
          Water Cow
        </Text>
        <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
          Your Hydration Companion 🐄💧
        </Text>

        {/* Custom Progress Bar */}
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: colors.primary },
              progressAnimatedStyle,
            ]}
          />
        </View>

        {/* Footer Tagline */}
        <Text style={[styles.loadingText, { color: colors.textTertiary }]}>
          Pure Hydration • Smart Reminders
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  contentCard: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  imageWrapper: {
    width: 220,
    height: 220,
    marginBottom: 20,
    shadowColor: '#4A9FD8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 28,
  },
  progressTrack: {
    width: width * 0.55,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
