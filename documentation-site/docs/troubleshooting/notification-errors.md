---
sidebar_position: 2
title: Notification Errors
---

# Troubleshooting Notification Errors

Solutions for issues related to notifications, custom sounds, and channel settings.

## 1. Notification Sound Plays Default Tone Instead of Custom Moo Sound

### Symptom
Notifications arrive, but play the default system beep instead of `moo1.mp3`.

### Cause
Android 8.0+ (API 26) caches notification channel properties (sound, importance, vibration) upon channel creation. Modifying code sound paths does not alter an existing channel registered on the device.

### Solution
1. Open App Settings on the Android device -> **Notifications** -> **Water Cow**.
2. Tap the notification channel and verify the Sound setting.
3. Uninstall the app completely from device/emulator and reinstall using `npx expo run:android` to force clean channel creation.
4. Ensure sound raw file exists at `android/app/src/main/res/raw/moo1.mp3` (lowercase, alphanumeric only).

## 2. Notifications Not Triggering in Background / Doze Mode

### Symptom
Notifications only show when app is open in foreground.

### Solution
- Check Android Battery Saver / Battery Optimization settings. Disable optimization for Water Cow.
- Ensure `POST_NOTIFICATIONS` permission was requested and granted on Android 13+ (API 33+).
