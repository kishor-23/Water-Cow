import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeatherIcon } from '../../components/ui/FeatherIcon';
import { createAudioPlayer } from 'expo-audio';
import { useHydration } from '../../context/HydrationContext';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { CowReminderAnimated } from '../../components/cow/CowReminderAnimated';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import type { ReminderSettings } from '../../utils/storage';
import { requestNotificationPermissions, sendTestNotification } from '../../utils/notifications';
import {
  getNextReminderTime,
  formatTime,
  getRelativeTime,
  getCountdownString,
} from '../../utils/hydration';

const INTERVALS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
];

const SNOOZE_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
];

const SOUND_OPTIONS = [
  { label: '🐄 Cow Moo', value: 'cow_moo' },
  { label: '🔔 Cow Bell', value: 'cow_bell' },
  { label: '🔔 Default Sound', value: 'default' },
];

export default function RemindersScreen() {
  const { state, updateReminders } = useHydration();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [settings, setSettings] = useState<ReminderSettings>(state.reminderSettings);

  // Live countdown timer state
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextReminder = getNextReminderTime(state.lastDrinkTime, settings.intervalMinutes);
  const countdownText = getCountdownString(nextReminder);

  useEffect(() => {
    setSettings(state.reminderSettings);
  }, [state.reminderSettings]);

  const handleToggle = async (enabled: boolean) => {
    // Instantly update state & context
    const updated = { ...settings, enabled };
    setSettings(updated);
    updateReminders(updated);

    // If enabling on native mobile, check/request permissions in background
    if (enabled && Platform.OS !== 'web') {
      try {
        const granted = await requestNotificationPermissions();
        if (!granted) {
          Alert.alert(
            'Notifications Notice',
            'Reminders are enabled! To receive alerts on your lock screen, please make sure notifications are allowed in phone Settings.',
            [{ text: 'OK' }]
          );
        }
      } catch (e) {
        console.warn('Permission check error:', e);
      }
    }
  };

  const handleIntervalChange = (value: number) => {
    const updated = { ...settings, intervalMinutes: value };
    setSettings(updated);
    updateReminders(updated);
  };

  const handleSnoozeChange = (value: number) => {
    const updated = { ...settings, snoozeDuration: value };
    setSettings(updated);
    updateReminders(updated);
  };

  const playSoundPreview = async (soundValue: string) => {
    if (soundValue === 'default') {
      return;
    }
    try {
      const audioSource =
        soundValue === 'cow_moo'
          ? require('../../assets/sounds/cow_moo.mp3')
          : require('../../assets/sounds/cow_bell.mp3');

      const player = createAudioPlayer(audioSource);
      player.play();
    } catch (error) {
      console.log('Error playing sound preview:', error);
    }
  };

  const handleSoundChange = (value: string) => {
    const updated = { ...settings, sound: value };
    setSettings(updated);
    updateReminders(updated);
    playSoundPreview(value);
  };

  const handleTimeChange = (field: 'startHour' | 'endHour', delta: number) => {
    const current = settings[field];
    const newValue = Math.min(23, Math.max(0, current + delta));
    const updated = { ...settings, [field]: newValue };
    setSettings(updated);
    updateReminders(updated);
  };

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Text style={styles.title}>Reminders</Text>

          {/* Animated Interactive Cow Mascot */}
          <View style={styles.cowSection}>
            <CowReminderAnimated
              enabled={settings.enabled}
              intervalMinutes={settings.intervalMinutes}
              enableSoundOnTap={true}
            />
          </View>

        {/* Smart Reminders Toggle */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleToggle(!settings.enabled)}
        >
          <Card style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <View
                  style={[
                    styles.toggleIconWrap,
                    {
                      backgroundColor: settings.enabled ? colors.surfaceBlue : colors.border,
                    },
                  ]}
                >
                  <FeatherIcon
                    name={settings.enabled ? 'bell' : 'bell-off'}
                    size={20}
                    color={settings.enabled ? colors.primary : colors.textTertiary}
                  />
                </View>
                <View style={styles.toggleText}>
                  <Text style={styles.toggleLabel}>Smart Reminders</Text>
                  <Text
                    style={[
                      styles.toggleDesc,
                      { color: settings.enabled ? colors.primary : colors.textTertiary, fontWeight: settings.enabled ? '600' : 'normal' },
                    ]}
                  >
                    {settings.enabled ? 'Active • Alerts Enabled' : 'Deactivated • Off'}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.enabled}
                onValueChange={handleToggle}
                trackColor={{
                  false: colors.border,
                  true: colors.primaryLight,
                }}
                thumbColor={settings.enabled ? colors.primary : colors.textTertiary}
              />
            </View>
          </Card>
        </TouchableOpacity>

        {settings.enabled && (
          <>
            {/* Live Countdown Timer & Next Notification Banner */}
            <Card style={[styles.sectionCard, { backgroundColor: colors.surfaceBlue, borderColor: colors.primaryLight, borderWidth: 1 }]}>
              <Text style={styles.sectionLabel}>Next Notification & Timer</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.size.xl, color: colors.textPrimary }}>
                    {formatTime(nextReminder)}
                  </Text>
                  <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: Typography.size.sm, color: colors.textTertiary, marginTop: 2 }}>
                    {getRelativeTime(nextReminder)}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <View style={{ backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: colors.primaryLight, flexDirection: 'row', alignItems: 'center' }}>
                    <FeatherIcon name="clock" size={14} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={{ fontFamily: Typography.fontFamily.bold, fontSize: Typography.size.md, color: colors.primary }}>
                      {countdownText}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Reminder Interval */}
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Reminder interval</Text>
              <View style={styles.pillRow}>
                {INTERVALS.map((interval) => (
                  <PillButton
                    key={interval.value}
                    label={interval.label}
                    selected={settings.intervalMinutes === interval.value}
                    onPress={() => handleIntervalChange(interval.value)}
                    size="sm"
                  />
                ))}
              </View>
            </Card>

            {/* Active Hours */}
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Active hours</Text>

              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Start time</Text>
                <View style={styles.timePicker}>
                  <TouchableOpacity
                    onPress={() => handleTimeChange('startHour', -1)}
                    style={styles.timeButton}
                  >
                    <FeatherIcon name="minus" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>
                    {formatHour(settings.startHour)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleTimeChange('startHour', 1)}
                    style={styles.timeButton}
                  >
                    <FeatherIcon name="plus" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.timeDivider} />

              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>End time</Text>
                <View style={styles.timePicker}>
                  <TouchableOpacity
                    onPress={() => handleTimeChange('endHour', -1)}
                    style={styles.timeButton}
                  >
                    <FeatherIcon name="minus" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>
                    {formatHour(settings.endHour)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleTimeChange('endHour', 1)}
                    style={styles.timeButton}
                  >
                    <FeatherIcon name="plus" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {/* Snooze */}
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Snooze duration</Text>
              <View style={styles.pillRow}>
                {SNOOZE_OPTIONS.map((option) => (
                  <PillButton
                    key={option.value}
                    label={option.label}
                    selected={settings.snoozeDuration === option.value}
                    onPress={() => handleSnoozeChange(option.value)}
                    size="sm"
                  />
                ))}
              </View>
            </Card>

            {/* Notification Sound */}
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Notification sound</Text>
              {SOUND_OPTIONS.map((sound) => (
                <TouchableOpacity
                  key={sound.value}
                  style={[
                    styles.soundOption,
                    settings.sound === sound.value && { backgroundColor: colors.surfaceBlue },
                  ]}
                  onPress={() => handleSoundChange(sound.value)}
                >
                  <Text
                    style={[
                      styles.soundLabel,
                      settings.sound === sound.value && { color: colors.textPrimary, fontFamily: Typography.fontFamily.medium },
                    ]}
                  >
                    {sound.label}
                  </Text>
                  {settings.sound === sound.value && (
                    <FeatherIcon name="check" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}

              {/* Immediate Test Notification Button */}
              <TouchableOpacity
                style={styles.testNotifyBtn}
                onPress={() => sendTestNotification(settings.sound)}
                activeOpacity={0.8}
              >
                <FeatherIcon name="bell" size={16} color={colors.primary} />
                <Text style={styles.testNotifyText}>Test Notification Sound 🔔</Text>
              </TouchableOpacity>
            </Card>
          </>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
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
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xxl,
    color: colors.textPrimary,
    paddingTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },

  // Cow
  cowSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  // Toggle Card
  toggleCard: {
    marginBottom: Spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  toggleIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    gap: 2,
    flex: 1,
  },
  toggleLabel: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
  },
  toggleDesc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
  },

  // Section Card
  sectionCard: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  // Time Picker
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  timeLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  timeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    color: colors.primary,
    minWidth: 80,
    textAlign: 'center',
  },
  timeDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: Spacing.xs,
  },

  // Sound Options
  soundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  soundLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.md,
    color: colors.textSecondary,
  },
  customInputContainer: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  customHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customInputLabel: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
  },
  customBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  customBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xs,
  },

  customStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  customStepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  customStepperBtnSmall: {
    paddingHorizontal: 8,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSmallText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
  },
  customInputWrapper: {
    flex: 1,
    maxWidth: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    height: 38,
    paddingHorizontal: 6,
    ...Shadows.sm,
  },
  customInput: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: 2,
    minWidth: 32,
    includeFontPadding: false,
  },
  customInputUnit: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
    marginLeft: 2,
  },

  quickChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xs,
  },
  testNotifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: colors.surfaceBlue,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  testNotifyText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
    color: colors.primary,
  },
});
