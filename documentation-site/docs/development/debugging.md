---
sidebar_position: 6
title: Debugging Guide
---

# Debugging Guide

This guide explains how to inspect, debug, and diagnose issues in Water Cow across JS, React, Expo, and Android native layers.

## 1. JavaScript & React Component Debugging

### React Native Dev Menu
- Press `d` in the terminal where `npx expo start` is running, or shake the physical device / press `Cmd+M` (macOS) / `Ctrl+M` (Windows) in the Android emulator.
- Select **Element Inspector** to inspect React components and layout bounds.
- Select **Toggle Performance Monitor** to inspect FPS and memory consumption.

### Chrome / React DevTools
- Open Chrome and navigate to `chrome://inspect`.
- Click **Inspect** under the target Hermes instance to open Chrome DevTools for step-by-step JS debugging and breakpoint inspection.

## 2. Native Android & Kotlin Debugging

### ADB Logcat
To view native Kotlin logs, crash tracebacks, or `Log.d()` calls from `WaterCowWidgetProvider`:

```bash
# Filter logcat output specifically for WaterCow tag
adb logcat -s WaterCowWidgetProvider:D WaterCowNotificationModule:D AndroidRuntime:E
```

### Android Studio Debugger
1. Open the `android/` directory in Android Studio.
2. Wait for Gradle sync to complete.
3. Click **Attach Debugger to Android Process** (icon with green bug and device).
4. Set breakpoints in Kotlin files (`WaterCowWidgetProvider.kt`, `WaterCowWidgetModule.kt`).

## 3. Storage Inspection (`AsyncStorage`)

To view stored JSON state on device:
- Use React Native Debugger or log `AsyncStorage.getItem('@water_cow_hydration_state')` inside `utils/storage.ts`.
