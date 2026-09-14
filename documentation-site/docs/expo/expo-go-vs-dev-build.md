---
sidebar_position: 2
title: Expo Go vs Development Builds
---

# Expo Go vs Development Build

Understanding the difference between **Expo Go** and a **Development Build** is crucial when working on Water Cow.

## Why Expo Go Will NOT Work for Water Cow

**Expo Go** is a pre-compiled app binary downloaded from the Google Play Store / App Store. It includes standard JavaScript runtimes and official Expo SDK APIs, but **it cannot execute custom native code**.

Because Water Cow includes custom native Kotlin Android code:
1. `WaterCowWidgetProvider.kt` (Android Home Screen Widget)
2. `WaterCowWidgetModule.kt` (Native Bridge Module)
3. `WaterCowNotificationModule.kt` (Custom sound channel creation)

Running `npx expo start` and scanning the QR code with **Expo Go will fail** or crash when native modules are invoked.

## Comparison

| Feature | Expo Go | Development Build (`expo-dev-client`) |
| :--- | :--- | :--- |
| **Native Code Support** | Pre-bundled modules only | Full support for custom Kotlin/Java native code |
| **Custom Android Widget** | ❌ No | ✅ Yes |
| **Custom Notification Channels** | ❌ Limited | ✅ Full control via Kotlin module |
| **Hot Reloading / Fast Refresh** | ✅ Yes | ✅ Yes |
| **Installation Method** | Play Store app | Custom APK installed via `adb` or USB |

## How to Run a Development Build

To run Water Cow locally with full native support:

```bash
# 1. Build and install the Android app onto your connected device or emulator
npx expo run:android

# 2. Start the Metro bundler (if not automatically started)
npx expo start
```
