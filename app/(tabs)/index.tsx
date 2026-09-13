/**
 * Home Screen — Dashboard with greeting, progress ring, cow mascot, and stats.
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
} from '../../utils/hydration';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { state, cowMood, progress, addWater } = useHydration();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();

  const { profile, totalConsumed, reminderSettings, lastDrinkTime } = state;
  const remaining = Math.max(profile.dailyGoal - totalConsumed, 0);

  const nextReminder = useMemo(() => {
    return getNextReminderTime(lastDrinkTime, reminderSettings.intervalMinutes);
  }, [lastDrinkTime, reminderSettings.intervalMinutes]);

  const greeting = getGreeting();
  const displayName = profile.name && profile.name.trim() ? profile.name : 'Buddy';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            activeOpacity={0.8}
          >
            <Text style={styles.greeting}>{greeting}, {displayName} 👋</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            {/* Progress Ring */}
            <ProgressRing
              progress={progress}
              size={180}
              strokeWidth={14}
              consumed={formatLiters(totalConsumed)}
              goal={`${formatLiters(profile.dailyGoal)} L`}
            />

            {/* Cow Mascot (Sipping Water) */}
            <View style={styles.cowContainer}>
              <CowReminderAnimated
                initialPose="sipping"
                hidePoseSelector={true}
                hideTapHint={true}
                size={120}
                enableSpeechBubble={true}
                shortSpeech={true}
              />
            </View>
          </View>

          {/* Cow message below */}
          <Card variant="blue" style={styles.moodCard}>
            <Text style={styles.moodText}>
              {progress >= 1
                ? "🎉 Amazing! Daily goal complete! Moo!"
                : cowMood === 'happy'
                  ? "😊 You're doing great! Keep it up!"
                  : cowMood === 'reminder'
                    ? "🥛 Time for a drink!"
                    : cowMood === 'tired'
                      ? "😴 I'm getting a bit tired..."
                      : "😢 Please drink some water!"
              }
            </Text>
          </Card>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatsCard
            icon="droplet"
            value={formatWater(totalConsumed)}
            label="Consumed"
            color={colors.primary}
          />
          <View style={{ width: Spacing.xs }} />
          <StatsCard
            icon="target"
            value={formatWater(remaining)}
            label="Remaining"
            color={colors.warning}
          />
          <View style={{ width: Spacing.xs }} />
          <StatsCard
            icon="clock"
            value={formatTime(nextReminder)}
            label={getRelativeTime(nextReminder)}
            color={colors.accentCyan}
          />
        </View>

        {/* Next Drink Card */}
        <Card style={styles.nextDrinkCard}>
          <View style={styles.nextDrinkRow}>
            <View style={styles.nextDrinkIconContainer}>
              <Feather name="bell" size={20} color={colors.primary} />
            </View>
            <View style={styles.nextDrinkInfo}>
              <Text style={styles.nextDrinkLabel}>Next drink</Text>
              <Text style={styles.nextDrinkTime}>{formatTime(nextReminder)}</Text>
            </View>
            <Text style={styles.nextDrinkRelative}>
              {getRelativeTime(nextReminder)}
            </Text>
          </View>
        </Card>

        {/* Quick Add Button */}
        <TouchableOpacity
          style={styles.quickAddButton}
          onPress={() => addWater(250)}
          activeOpacity={0.85}
        >
          <View style={styles.quickAddContent}>
            <Feather name="plus" size={22} color={colors.textOnPrimary} />
            <Text style={styles.quickAddText}>+ 250 ml</Text>
          </View>
        </TouchableOpacity>

        {/* Secondary Action */}
        <TouchableOpacity
          style={styles.customAddButton}
          onPress={() => router.push('/add')}
          activeOpacity={0.7}
        >
          <Text style={styles.customAddText}>Log a different amount</Text>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
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
    paddingBottom: 120,
  },

  // Header
  header: {
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  greeting: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xxl,
    color: colors.textPrimary,
  },
  date: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
    marginTop: 4,
  },

  // Progress
  progressSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  cowContainer: {
    marginLeft: -10,
  },
  moodCard: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  moodText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    flexWrap: 'wrap',
  },

  // Stats
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
    fontSize: Typography.size.sm,
    color: colors.primary,
    flexShrink: 0,
    textAlign: 'right',
  },

  // Quick Add
  quickAddButton: {
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  quickAddContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickAddText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.lg,
    color: colors.textOnPrimary,
  },

  // Custom Add
  customAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: 4,
  },
  customAddText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: colors.primary,
  },
});
