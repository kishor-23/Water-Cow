/**
 * Home Screen — Classic dashboard layout with side-by-side Progress Ring & Cow Mascot.
 * Redesigned for 6.7" screens with Quick Sip dock, Today's Intake timeline, and rich streak indicators.
 */
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeatherIcon } from '../../components/ui/FeatherIcon';
import { useRouter } from 'expo-router';
import { useHydration } from '../../context/HydrationContext';
import { CowReminderAnimated } from '../../components/cow/CowReminderAnimated';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { DrinkIcon } from '../../components/ui/DrinkIcon';
import { DEFAULT_CUP_SIZES, type CupSizes } from '../../utils/storage';
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
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();

  const { width: screenWidth } = useWindowDimensions();
  const isWide = screenWidth >= 768;

  const ringSize = isWide ? 200 : 175;
  const ringStroke = isWide ? 15 : 14;
  const mascotSize = isWide ? 150 : 135;

  const { profile, totalConsumed, reminderSettings, lastDrinkTime } = state;
  const remaining = Math.max(profile.dailyGoal - totalConsumed, 0);

  const cupSizes: CupSizes = profile.cupSizes || DEFAULT_CUP_SIZES;

  const quickPresets = useMemo(() => [
    { key: 'glass' as const, amount: cupSizes.glass, name: 'Glass' },
    { key: 'cup' as const, amount: cupSizes.cup, name: 'Cup' },
    { key: 'mug' as const, amount: cupSizes.mug, name: 'Mug' },
    { key: 'bottle' as const, amount: cupSizes.bottle, name: 'Bottle' },
  ], [cupSizes]);

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


  // Today's recent drinks (sorted latest first, show up to 3)
  const recentEntries = useMemo(() => {
    return [...state.entries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
  }, [state.entries]);

  const MASCOT_QUOTES = [
    "Oii! 🐮",
    "Howdy! 🤠",
    "Hi! 👋",
    "Moo! 🥛",
    "Sip! 💧",
    "Yo! ✨",
  ];

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
        contentContainerStyle={[
          styles.scrollContent,
          isWide && styles.scrollContentWide,
        ]}
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

        {/* Content Body: 2-column on wide screens, single column on phones */}
        <View style={isWide ? styles.wideColumns : styles.mobileColumn}>
          {/* Section A: Hero Unit, Motivation, & Quick Sip Dock */}
          <View style={isWide ? styles.wideLeftColumn : styles.sectionGroup}>
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
                  size={ringSize}
                  strokeWidth={ringStroke}
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
                  size={mascotSize}
                  enableSoundOnTap={true}
                  enableSpeechBubble={true}
                  shortSpeech={true}
                  customQuotes={MASCOT_QUOTES}
                />
              </View>
            </View>

            {/* Daily Hydration Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeaderRow}>
                <Text style={styles.statusMessage} numberOfLines={1}>
                  {moodMessage}
                </Text>
                <View style={[styles.percentBadge, { backgroundColor: colors.surfaceBlue }]}>
                  <Text style={[styles.percentBadgeText, { color: colors.primary }]}>
                    {Math.round(progress * 100)}%
                  </Text>
                </View>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(progress * 100, 100)}%`,
                      backgroundColor: progress >= 1 ? colors.success : colors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            {/* One-Tap Quick Sip Dock */}
            <View style={styles.quickDockSection}>
              <View style={styles.dockHeaderRow}>
                <Text style={styles.dockTitle}>Quick Sip</Text>
                <Text style={styles.dockSub}>1-Tap Log</Text>
              </View>
              <View style={styles.presetsRow}>
                {quickPresets.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.presetCard, { backgroundColor: colors.surface }]}
                    onPress={() => addWater(item.amount)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.presetIconWrap, { backgroundColor: colors.surfaceBlue }]}>
                      <DrinkIcon type={item.key} size={18} color={colors.primary} />
                    </View>
                    <Text style={[styles.presetAmount, { color: colors.textPrimary }]}>
                      {item.amount} ml
                    </Text>
                    <Text style={[styles.presetName, { color: colors.textTertiary }]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Section B: Stats, Next Reminder, Activity Timeline, & Actions */}
          <View style={isWide ? styles.wideRightColumn : styles.sectionGroup}>
            {/* Stats Grid */}
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

            {/* Next Drink Reminder Card */}
            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/reminders')}>
              <Card style={styles.nextDrinkCard}>
                <View style={styles.nextDrinkRow}>
                  <View style={styles.nextDrinkIconContainer}>
                    <FeatherIcon name="bell" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.nextDrinkInfo}>
                    <Text style={styles.nextDrinkLabel}>Next Notification & Timer</Text>
                    <Text style={styles.nextDrinkTime}>{formatTime(nextReminder)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={[styles.timerBadge, { backgroundColor: colors.surfaceBlue }]}>
                      <FeatherIcon name="clock" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.timerBadgeText, { color: colors.primary }]}>{countdownText}</Text>
                    </View>
                    <Text style={styles.nextDrinkRelative}>
                      {getRelativeTime(nextReminder)}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>

            {/* Today's Intake Activity Preview */}
            <Card style={styles.activityCard}>
              <View style={styles.activityHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FeatherIcon name="calendar" size={15} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.activityTitle}>Today's Intake</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/history')} hitSlop={8}>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>View History →</Text>
                </TouchableOpacity>
              </View>

              {recentEntries.length > 0 ? (
                <View style={styles.entriesList}>
                  {recentEntries.map((entry, idx) => (
                    <View
                      key={entry.id || idx}
                      style={[
                        styles.entryItem,
                        idx < recentEntries.length - 1 && styles.entryDivider,
                      ]}
                    >
                      <View style={styles.entryLeft}>
                        <View style={[styles.entryIconDot, { backgroundColor: colors.surfaceBlue }]}>
                          <FeatherIcon name="droplet" size={11} color={colors.primary} />
                        </View>
                        <Text style={styles.entryTime}>
                          {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </Text>
                      </View>
                      <Text style={[styles.entryAmount, { color: colors.primary }]}>
                        +{formatWater(entry.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyActivity}>
                  <Text style={styles.emptyActivityText}>
                    No drinks logged yet today. Tap a quick cup above to start! 🥛
                  </Text>
                </View>
              )}
            </Card>

            {/* Dual Action Row */}
            <View style={styles.actionRow}>
              {/* Left: Custom Log */}
              <TouchableOpacity
                style={styles.customAddButton}
                onPress={() => router.push('/add')}
                activeOpacity={0.8}
              >
                <FeatherIcon name="edit-3" size={16} color={colors.primary} />
                <Text style={styles.customAddText}>Custom Log</Text>
              </TouchableOpacity>

              {/* Right: Quick Add Button */}
              <TouchableOpacity
                style={styles.quickAddButton}
                onPress={() => addWater(profile.quickAddAmount || 250)}
                activeOpacity={0.85}
              >
                <FeatherIcon name="plus" size={18} color={colors.textOnPrimary} />
                <Text style={styles.quickAddText} numberOfLines={1}>
                  {formatWater(profile.quickAddAmount || 250)} Quick
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 110,
  },
  scrollContentWide: {
    maxWidth: 1040,
    paddingBottom: 50,
  },
  wideColumns: {
    flexDirection: 'row',
    gap: Spacing.xl,
    alignItems: 'flex-start',
  },
  wideLeftColumn: {
    flex: 1,
  },
  wideRightColumn: {
    flex: 1.1,
  },
  mobileColumn: {
    width: '100%',
  },
  sectionGroup: {
    width: '100%',
  },

  // Header
  header: {
    marginBottom: Spacing.md,
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
    fontSize: 24,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  waveEmoji: {
    fontSize: 22,
    marginLeft: 6,
  },
  dateText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // Hero Row (Side-by-side Progress Ring & Cow Mascot)
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Daily Status Card
  statusCard: {
    backgroundColor: colors.surfaceBlue,
    borderRadius: BorderRadius.xl,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows.sm,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusMessage: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
    color: colors.textPrimary,
    flex: 1,
    marginRight: Spacing.xs,
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  percentBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xs,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Quick Sip Dock
  quickDockSection: {
    marginBottom: Spacing.md,
  },
  dockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  dockTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
    color: colors.textPrimary,
  },
  dockSub: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows.sm,
  },
  presetIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  presetAmount: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 12,
  },
  presetName: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    marginTop: 1,
  },

  // Stats Grid
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },

  // Next Drink Card
  nextDrinkCard: {
    marginBottom: Spacing.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
  },
  nextDrinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextDrinkIconContainer: {
    width: 38,
    height: 38,
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
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
  },
  nextDrinkTime: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
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

  // Activity Card
  activityCard: {
    marginBottom: Spacing.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
  },
  activityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
  },
  entriesList: {
    gap: 8,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  entryDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  entryIconDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryTime: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: colors.textSecondary,
  },
  entryAmount: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
  },
  emptyActivity: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  emptyActivityText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
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
    paddingVertical: 13,
    paddingHorizontal: Spacing.sm,
    ...Shadows.sm,
  },
  customAddText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
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
    paddingVertical: 13,
    paddingHorizontal: Spacing.sm,
    ...Shadows.md,
  },
  quickAddText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.sm,
    color: colors.textOnPrimary,
  },
});
