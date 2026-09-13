/**
 * Notification scheduling utilities using expo-notifications.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { ReminderSettings } from './storage';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowInForeground: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const MOO_MESSAGES = [
  "Moo! 🐄 Time for a drink of water!",
  "Hey! Your cow friend is thirsty! 💧",
  "Moo~ Don't forget to hydrate! 🐄",
  "Water break! Your cow companion needs you! 💧",
  "Stay hydrated! Moo! 🐄💧",
];

const URGENT_MESSAGES = [
  "Mooo! 🐄😢 You haven't had water in a while!",
  "Your cow is getting tired... Please drink water! 🐄",
  "Moooo! Don't forget about me! I need water! 💧",
];

/**
 * Current channel version — bump this when you need to force Android
 * to recreate notification channels with new settings (e.g., sound changes).
 *
 * Android caches notification channels permanently: once a channel is created,
 * its sound/vibration/importance settings are LOCKED and cannot be changed
 * programmatically. The only way to apply new settings is to create a NEW
 * channel with a different ID. That's why we use a version suffix.
 */
const CHANNEL_VERSION = 'v7';

/** All old channel IDs that should be cleaned up. */
const OLD_CHANNEL_IDS = [
  'water_reminders',
  'water_reminders_moo',
  'water_reminders_bell',
  'water_reminders_default',
  'water_reminders_moo_v1',
  'water_reminders_bell_v1',
  'water_reminders_default_v1',
  'water_reminders_moo_v2',
  'water_reminders_bell_v2',
  'water_reminders_default_v2',
  'water_reminders_moo_v3',
  'water_reminders_bell_v3',
  'water_reminders_default_v3',
  'water_reminders_moo_v4',
  'water_reminders_bell_v4',
  'water_reminders_default_v4',
  'water_reminders_moo_v5',
  'water_reminders_bell_v5',
  'water_reminders_default_v5',
  'water_reminders_moo_v6',
  'water_reminders_bell_v6',
  'water_reminders_default_v6',
];

/**
 * Delete stale notification channels left over from previous versions.
 * This keeps the user's notification settings tidy and ensures fresh
 * channels are created with the correct sound configuration.
 */
async function cleanupOldChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;
  for (const channelId of OLD_CHANNEL_IDS) {
    try {
      await Notifications.deleteNotificationChannelAsync(channelId);
    } catch {
      // Channel may not exist — that's fine, skip silently
    }
  }
}

/**
 * Request notification permissions and configure notification channels.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      // Clean up old versioned channels first
      await cleanupOldChannels();

      // Create fresh channels with correct sound settings.
      // The sound filename must match the file in android/app/src/main/res/raw/
      // without the file extension (Android resource convention).
      await Notifications.setNotificationChannelAsync(`water_reminders_moo_${CHANNEL_VERSION}`, {
        name: 'Water Reminders (Cow Moo)',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'cow_moo',
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.NOTIFICATION,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        },
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A9FD8',
        enableVibrate: true,
      }).catch((e) => console.warn('Failed to set moo channel:', e));

      await Notifications.setNotificationChannelAsync(`water_reminders_bell_${CHANNEL_VERSION}`, {
        name: 'Water Reminders (Cow Bell)',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'cow_bell',
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.NOTIFICATION,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        },
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A9FD8',
        enableVibrate: true,
      }).catch((e) => console.warn('Failed to set bell channel:', e));

      await Notifications.setNotificationChannelAsync(`water_reminders_default_${CHANNEL_VERSION}`, {
        name: 'Water Reminders (Default)',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A9FD8',
        enableVibrate: true,
      }).catch((e) => console.warn('Failed to set default channel:', e));
    }

    return true;
  } catch (error) {
    console.warn('Failed to request notification permissions:', error);
    return false;
  }
}

/**
 * Returns the Android notification channel ID for the given sound setting.
 */
function getChannelId(sound: string): string {
  if (sound === 'cow_moo') return `water_reminders_moo_${CHANNEL_VERSION}`;
  if (sound === 'cow_bell') return `water_reminders_bell_${CHANNEL_VERSION}`;
  return `water_reminders_default_${CHANNEL_VERSION}`;
}

/**
 * Returns the sound value for the notification content.
 * On Android the sound is controlled by the channel, so this mainly
 * matters for iOS. We still set it for cross-platform consistency.
 */
function getSoundValue(sound: string): string | boolean {
  if (sound === 'cow_moo') return Platform.OS === 'android' ? 'cow_moo' : 'cow_moo.mp3';
  if (sound === 'cow_bell') return Platform.OS === 'android' ? 'cow_bell' : 'cow_bell.mp3';
  return true; // system default
}

/**
 * Send an immediate test notification with the chosen sound.
 */
export async function sendTestNotification(sound: string): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const channelId = getChannelId(sound);
    const soundFile = getSoundValue(sound);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Water Cow 🐄💧',
        body: sound === 'cow_bell' ? 'Ring ring! 🔔 Cow Bell reminder test!' : 'Moo! 🐄 Time to drink water test!',
        data: { type: 'test' },
        sound: soundFile,
        ...(Platform.OS === 'android' && { channelId }),
      },
      trigger: null, // deliver immediately
    });
  } catch (error) {
    console.warn('Failed to send test notification:', error);
  }
}

/**
 * Schedule recurring water reminders.
 */
export async function scheduleReminders(settings: ReminderSettings): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});

    if (!settings.enabled) return;

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // Schedule reminders from start to end time at the given interval
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(settings.startHour, settings.startMinute, 0, 0);

    const endDate = new Date(now);
    endDate.setHours(settings.endHour, settings.endMinute, 0, 0);

    // Determine channel ID and sound
    const channelId = getChannelId(settings.sound);
    const soundFile = getSoundValue(settings.sound);

    // If start time has already passed today, begin from the next interval
    let nextReminder = new Date(startDate);
    if (nextReminder.getTime() < Date.now()) {
      const elapsed = Date.now() - nextReminder.getTime();
      const intervals = Math.ceil(elapsed / (settings.intervalMinutes * 60 * 1000));
      nextReminder = new Date(
        startDate.getTime() + intervals * settings.intervalMinutes * 60 * 1000
      );
    }

    // Schedule up to 20 reminders
    let count = 0;
    while (
      nextReminder.getTime() <= endDate.getTime() &&
      nextReminder.getTime() > Date.now() &&
      count < 20
    ) {
      const message =
        MOO_MESSAGES[Math.floor(Math.random() * MOO_MESSAGES.length)];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Water Cow 🐄💧',
          body: message,
          data: { type: 'reminder' },
          sound: soundFile,
          ...(Platform.OS === 'android' && { channelId }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: nextReminder,
        },
      }).catch((e) => console.warn('Failed to schedule notification:', e));

      nextReminder = new Date(
        nextReminder.getTime() + settings.intervalMinutes * 60 * 1000
      );
      count++;
    }
  } catch (error) {
    console.warn('Error in scheduleReminders:', error);
  }
}

/**
 * Cancel all scheduled reminders.
 */
export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Error in cancelAllReminders:', error);
  }
}
