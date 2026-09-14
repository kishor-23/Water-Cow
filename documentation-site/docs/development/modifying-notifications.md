---
sidebar_position: 2
title: Modifying Notifications
---

# Modifying Notifications

This guide covers how to modify notification schedules, content, sound effects, or channel behavior.

## Changing Notification Intervals or Times

1. Open `services/notificationService.ts`.
2. Locate `schedulePeriodicNotifications()` or `scheduleCustomIntervalNotifications()`.
3. Update calculation logic for trigger dates/times:
   ```typescript
   await Notifications.scheduleNotificationAsync({
     content: {
       title: "Time to hydrate! 🐮💧",
       body: getCowNotificationMessage(currentMood),
       sound: selectedSound === 'default' ? true : `${selectedSound}.mp3`,
     },
     trigger: {
       hour: targetHour,
       minute: targetMinute,
       repeats: true,
     },
   });
   ```

## Adding a New Sound File

1. Add the `.mp3` or `.wav` sound file to `assets/sounds/` (e.g. `assets/sounds/bell.mp3`).
2. Register the sound in `app.json` under `expo-notifications` plugin:
   ```json
   "sounds": [
     "./assets/sounds/moo1.mp3",
     "./assets/sounds/bell.mp3"
   ]
   ```
3. Copy or copy-task sound file into Android raw resources:
   `android/app/src/main/res/raw/bell.mp3`
4. Update `NOTIFICATION_SOUNDS` array in `constants/sounds.ts`:
   ```typescript
   export const NOTIFICATION_SOUNDS = [
     { id: 'moo1', name: 'Moo 1', file: require('../assets/sounds/moo1.mp3') },
     { id: 'bell', name: 'Bell', file: require('../assets/sounds/bell.mp3') },
   ];
   ```
5. Update Kotlin native channel creation module (`WaterCowNotificationModule.kt`) if dynamic channel registration is required for custom sound playback on Android 8.0+ (API 26+).

> [!IMPORTANT]
> When adding a sound, remember to bump the notification channel version string (`channel_v2`, `channel_v3`, etc.) so Android creates a new notification channel for the sound to take effect.
