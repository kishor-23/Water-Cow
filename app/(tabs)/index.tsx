/**
 * Home Screen — Classic dashboard layout with side-by-side Progress Ring & Cow Mascot.
 */
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useHydration } from '../../context/HydrationContext';
import { CowReminderAnimated } from '../../components/cow/CowReminderAnimated';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  getGreeting,
  formatLiters,
  formatWater,
  formatTime,
  getRelativeTime,
  getNextReminderTime,
  getCountdownString,
} from '../../utils/hydration';

export default function HomeScreen() {
  const { state, cowMood, progress, addWater } = useHydration();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();

  const { profile, totalConsumed, reminderSettings, lastDrinkTime } = state;
  const remaining = Math.max(profile.dailyGoal - totalConsumed, 0);

  // Ticking timer state for live countdown
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextReminder = useMemo(() => {
    return getNextReminderTime(lastDrinkTime, reminderSettings.intervalMinutes);
  }, [lastDrinkTime, reminderSettings.intervalMinutes, now]);

  const countdownText = useMemo(() => {
    return getCountdownString(nextReminder);
  }, [nextReminder, now]);

  const greeting = getGreeting();
  const displayName = profile.name && profile.name.trim() ? profile.name : 'Buddy';

  const MASCOT_QUOTES = [
    "Oii! 🐮",
    "Howdy! 🤠",
    "Hi! 👋",
    "Moo! 🥛",
    "Sip! 💧",
    "Yo! ✨",
  ];

  const [quoteIndex, setQuoteIndex] = React.useState(0);
  const currentQuote = MASCOT_QUOTES[quoteIndex];

  const moodMessage = useMemo(() => {
    if (progress >= 1) return "🎉 Amazing! Daily goal complete! Moo!";
    if (cowMood === 'happy') return "😊 You're doing great! Keep it up!";
    if (cowMood === 'reminder') return "🥛 Time for a refreshing sip!";
    if (cowMood === 'tired') return "😴 Getting a bit thirsty here...";
    return "😢 Please drink some water!";
  }, [progress, cowMood]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.greetingTitleRow}>
                <Text
                  style={styles.greetingTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {greeting}, {displayName}
                </Text>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* HERO ROW: Side-by-side Progress Ring & Animated Cow Mascot */}
        <View style={styles.heroRow}>
          {/* Progress Ring (Tapping navigates to History) */}
          <TouchableOpacity
            style={styles.ringContainer}
            onPress={() => router.push('/history')}
            activeOpacity={0.8}
          >
            <ProgressRing
              progress={progress}
              size={175}
              strokeWidth={14}
              consumed={formatLiters(totalConsumed)}
              goal={`${formatLiters(profile.dailyGoal)} L`}
            />
          </TouchableOpacity>

          {/* Cow Mascot */}
          <View style={styles.mascotContainer}>
            <CowReminderAnimated
              initialPose="sipping"
              hidePoseSelector={true}
              hideTapHint={true}
              size={135}
              enableSoundOnTap={true}
              enableSpeechBubble={true}
              shortSpeech={true}
              customQuotes={MASCOT_QUOTES}
            />
          </View>
        </View>

        {/* Mood Message Pill Card */}
        <View style={styles.moodPillCard}>
          <Text style={styles.moodPillText}>{moodMessage}</Text>
        </View>

        {/* SECTION 2: Stats Grid with Direct Navigation to History & Reminders */}
        <View style={styles.statsRow}>
          <StatsCard
            icon="droplet"
            value={formatWater(totalConsumed)}
            label="Consumed"
            color={colors.primary}
            onPress={() => router.push('/history')}
          />
          <View style={{ width: Spacing.xs }} />
          <StatsCard
            icon="target"
            value={formatWater(remaining)}
            label="Remaining"
            color={colors.warning}
            onPress={() => router.push('/history')}
          />
          <View style={{ width: Spacing.xs }} />
          <StatsCard
            icon="clock"
            value={formatTime(nextReminder)}
            label={getRelativeTime(nextReminder)}
            color={colors.accentCyan}
            onPress={() => router.push('/reminders')}
          />
        </View>

        {/* SECTION 3: Next Drink Reminder Card with Ticking Countdown Timer */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/reminders')}>
          <Card style={styles.nextDrinkCard}>
            <View style={styles.nextDrinkRow}>
              <View style={styles.nextDrinkIconContainer}>
                <Feather name="bell" size={20} color={colors.primary} />
              </View>
              <View style={styles.nextDrinkInfo}>
                <Text style={styles.nextDrinkLabel}>Next Notification & Timer</Text>
                <Text style={styles.nextDrinkTime}>{formatTime(nextReminder)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={[styles.timerBadge, { backgroundColor: colors.surfaceBlue }]}>
                  <Feather name="clock" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                  <Text style={[styles.timerBadgeText, { color: colors.primary }]}>{countdownText}</Text>
                </View>
                <Text style={styles.nextDrinkRelative}>
                  {getRelativeTime(nextReminder)}
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* SECTION 4: Dual Action Row (Left: Custom Log | Right: Quick Drink) */}
        <View style={styles.actionRow}>
          {/* Left: Custom Log */}
          <TouchableOpacity
            style={styles.customAddButton}
            onPress={() => router.push('/add')}
            activeOpacity={0.8}
          >
            <Feather name="edit-3" size={16} color={colors.primary} />
            <Text style={styles.customAddText}>Custom Log</Text>
          </TouchableOpacity>

          {/* Right: Quick Add Button */}
          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={() => addWater(profile.quickAddAmount || 250)}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={18} color={colors.textOnPrimary} />
            <Text style={styles.quickAddText} numberOfLines={1}>
              + {formatWater(profile.quickAddAmount || 250)} Quick
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 120,
  },

  // Header
  header: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 26,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  waveEmoji: {
    fontSize: 24,
    marginLeft: 6,
  },
  dateText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.md,
    color: colors.textTertiary,
    marginTop: 4,
  },

  // Hero Row (Side-by-side Progress Ring & Cow Mascot)
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mood Pill Card (Image 1)
  moodPillCard: {
    backgroundColor: colors.surfaceBlue,
    borderRadius: BorderRadius.xxl || 24,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  moodPillText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Stats Grid
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },

  // Next Drink
  nextDrinkCard: {
    marginBottom: Spacing.lg,
  },
  nextDrinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextDrinkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.surfaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDrinkInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.xs,
  },
  nextDrinkLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
  },
  nextDrinkTime: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.lg,
    color: colors.textPrimary,
  },
  nextDrinkRelative: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
    flexShrink: 0,
    textAlign: 'right',
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: 2,
  },
  timerBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xs,
  },

  // Action Row (Single Row Layout)
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  customAddButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: colors.surfaceBlue,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: Spacing.sm,
    ...Shadows.sm,
  },
  customAddText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    color: colors.primary,
  },
  quickAddButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: Spacing.sm,
    ...Shadows.md,
  },
  quickAddText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
    color: colors.textOnPrimary,
  },
});
