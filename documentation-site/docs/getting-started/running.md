---
sidebar_position: 3
title: Running the App
---

# Running the App

## Start Development

```bash
# Install dependencies (first time or after package.json changes)
npm install

# Start the Metro bundler + build + install on device
npx expo run:android
```

The first build takes 3–10 minutes (downloads Gradle dependencies, compiles native code). Subsequent builds are much faster.

## Development Server Only

If the app is already installed on your device and you only changed TypeScript/React code:

```bash
npx expo start
```

This starts the Metro bundler. The app on your device connects to it and **hot-reloads** changes instantly — no rebuild needed.

### Clear Cache

If you see stale behavior or strange errors:

```bash
npx expo start --clear
```

## When Do I Need to Rebuild?

| What Changed | Action |
|-------------|--------|
| `.tsx` / `.ts` files | Nothing — hot-reload is automatic |
| `app.json` | Restart Metro (`npx expo start`) |
| `package.json` (new dependency) | `npm install` → `npx expo run:android` |
| Kotlin/Java files | `npx expo run:android` (full rebuild) |
| `AndroidManifest.xml` | `npx expo run:android` (full rebuild) |
| `res/` XML, layouts, drawables | `npx expo run:android` (full rebuild) |
| `eas.json` | Only affects cloud builds |

:::tip Hot Reload
React Native's "Fast Refresh" means you almost never need to restart during UI development. Change a component, save the file, and the change appears on your device within 1–2 seconds.
:::

## Running on Multiple Devices

If you have multiple devices/emulators connected:

```bash
# List connected devices
adb devices

# Run on a specific device
npx expo run:android --device <device-id>
```

## Viewing Logs

```bash
# React Native / Metro logs appear in the terminal running `npx expo start`

# Native Android logs (Kotlin, system)
adb logcat
# Filter to just the app:
adb logcat -s ReactNativeJS WaterCowWidget WaterCowNotification
```

## Common First-Run Issues

### "SDK location not found"
Set `ANDROID_HOME` environment variable. See [Development Environment](/docs/getting-started/development-environment).

### "JAVA_HOME is not set"
Set `JAVA_HOME` to your JDK 17 installation. See [JDK Guide](/docs/android/jdk).

### "Could not find tools.jar"
You installed a JRE instead of a JDK. Install JDK 17.

### "No connected devices"
1. Enable USB Debugging on your phone
2. Run `adb devices` and ensure the device appears
3. Accept the USB debugging prompt on your phone
