import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FeatherIcon } from './FeatherIcon';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { CowReminderAnimated, ReminderCowPose } from '../cow/CowReminderAnimated';

interface CowSliderBannerProps {
  displayName?: string;
  onTapQuote?: () => void;
}

const getSlides = (displayName: string): Array<{
  id: string;
  title: string;
  subtitle: string;
  quote: string;
  cowCallout: string;
  pose: ReminderCowPose;
}> => [
  {
    id: 'slide-1',
    title: `Hey ${displayName}!`,
    subtitle: 'Time for some water?',
    quote: 'A healthier you makes a happier moo! 💖',
    cowCallout: 'Drink\nBe healthy\nMoo! 💙',
    pose: 'sipping',
  },
  {
    id: 'slide-2',
    title: 'Hydration Tip 💧',
    subtitle: 'Sip smart all day long',
    quote: 'Drinking water boosts energy, skin & focus! ✨',
    cowCallout: 'Stay fresh\nFeel awesome!\n🥛',
    pose: 'bell',
  },
  {
    id: 'slide-3',
    title: 'Daily Goal 🎯',
    subtitle: 'Every drop counts',
    quote: 'Small sips today lead to big health tomorrow! 💙',
    cowCallout: 'You got this!\nMoo! 🎉',
    pose: 'cheering',
  },
];

export const CowSliderBanner: React.FC<CowSliderBannerProps> = ({
  displayName = 'Buddy',
  onTapQuote,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [activeIndex, setActiveIndex] = useState(0);

  const SLIDES = getSlides(displayName);

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlide = SLIDES[activeIndex];

  return (
    <View style={styles.container}>
      {/* Banner Card */}
      <View style={styles.bannerCard}>
        <View style={styles.contentRow}>
          {/* Left Column: Text & Speech Bubble */}
          <View style={styles.leftColumn}>
            <Text style={styles.titleText} numberOfLines={1}>{currentSlide.title}</Text>
            <Text style={styles.subtitleText}>{currentSlide.subtitle}</Text>
            <View style={styles.underlineBar} />

            {/* Speech Bubble */}
            <TouchableOpacity
              style={styles.speechBubble}
              activeOpacity={0.85}
              onPress={onTapQuote || handleNext}
            >
              <Text style={styles.speechBubbleText}>{currentSlide.quote}</Text>
              {/* Bubble Pointer Tail */}
              <View style={styles.speechBubbleTail} />
            </TouchableOpacity>
          </View>

          {/* Right Column: Cow Mascot & Callout */}
          <View style={styles.rightColumn}>
            <Text style={styles.cowCalloutText}>{currentSlide.cowCallout}</Text>
            <View style={styles.cowContainer}>
              <CowReminderAnimated
                initialPose={currentSlide.pose}
                hidePoseSelector={true}
                hideTapHint={true}
                size={115}
                enableSoundOnTap={true}
                enableSpeechBubble={false}
              />
            </View>
          </View>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((slide, idx) => (
            <TouchableOpacity
              key={slide.id}
              onPress={() => setActiveIndex(idx)}
              style={[
                styles.paginationDot,
                idx === activeIndex
                  ? styles.paginationDotActive
                  : styles.paginationDotInactive,
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            />
          ))}
        </View>

        {/* Navigation Arrow - Prev */}
        <TouchableOpacity
          style={[styles.arrowButton, styles.arrowLeft]}
          onPress={handlePrev}
          activeOpacity={0.8}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <FeatherIcon name="chevron-left" size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* Navigation Arrow - Next */}
        <TouchableOpacity
          style={[styles.arrowButton, styles.arrowRight]}
          onPress={handleNext}
          activeOpacity={0.8}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <FeatherIcon name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginVertical: Spacing.lg,
      width: '100%',
    },
    bannerCard: {
      backgroundColor: colors.surfaceBlue,
      borderRadius: 26,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xxl + 4,
      paddingHorizontal: Spacing.lg + 4,
      borderWidth: 1.5,
      borderColor: colors.border,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 185,
      ...Shadows.md,
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    // Left Column
    leftColumn: {
      flex: 1,
      paddingLeft: Spacing.sm,
      paddingRight: Spacing.xs,
    },
    titleText: {
      fontFamily: Typography.fontFamily.bold,
      fontSize: 23,
      color: colors.textPrimary,
      letterSpacing: -0.4,
    },
    subtitleText: {
      fontFamily: Typography.fontFamily.semiBold,
      fontSize: 14.5,
      color: colors.primary,
      marginTop: 2,
    },
    underlineBar: {
      width: 58,
      height: 4,
      backgroundColor: colors.primaryLight || colors.primary,
      borderRadius: 2,
      marginTop: 4,
      marginBottom: Spacing.sm + 2,
    },

    // Talk Bubble
    speechBubble: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md + 2,
      paddingVertical: Spacing.sm + 4,
      borderWidth: 1.5,
      borderColor: colors.border,
      position: 'relative',
      marginTop: 2,
      maxWidth: '96%',
      ...Shadows.sm,
    },
    speechBubbleText: {
      fontFamily: Typography.fontFamily.medium,
      fontSize: 12.5,
      color: colors.textPrimary,
      lineHeight: 18,
    },
    speechBubbleTail: {
      position: 'absolute',
      right: -8,
      top: 14,
      width: 0,
      height: 0,
      borderTopWidth: 6,
      borderBottomWidth: 6,
      borderLeftWidth: 8,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: colors.surface,
    },

    // Right Column
    rightColumn: {
      width: 130,
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: Spacing.xs,
    },
    cowCalloutText: {
      fontFamily: Typography.fontFamily.semiBold,
      fontSize: 12,
      color: colors.primary,
      textAlign: 'center',
      lineHeight: 15,
      marginBottom: 2,
    },
    cowContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Pagination
    paginationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      bottom: 14,
      left: Spacing.xl,
      gap: 6,
    },
    paginationDot: {
      height: 8,
      borderRadius: 4,
    },
    paginationDotActive: {
      width: 22,
      backgroundColor: colors.primary,
    },
    paginationDotInactive: {
      width: 8,
      backgroundColor: colors.textTertiary || colors.border,
      opacity: 0.4,
    },

    // Nav Arrows
    arrowButton: {
      position: 'absolute',
      top: '50%',
      marginTop: -18,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.border,
      zIndex: 10,
      ...Shadows.md,
    },
    arrowLeft: {
      left: 8,
    },
    arrowRight: {
      right: 8,
    },
  });
