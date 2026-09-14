---
sidebar_position: 3
title: Widget Errors
---

# Troubleshooting Widget Errors

Solutions for home screen widget render and sync issues.

## 1. Widget Displays "Problem Loading Widget"

### Symptom
Red warning box or text on Android home screen stating "Problem loading widget".

### Cause
An uncaught exception occurred in `WaterCowWidgetProvider.onUpdate()` or `RemoteViews` encountered an invalid resource ID (e.g. missing layout reference or invalid asset).

### Solution
1. Run `adb logcat -s WaterCowWidgetProvider:E AndroidRuntime:E` while adding the widget to inspect exact Kotlin stack trace.
2. Check `android/app/src/main/res/layout/water_cow_widget.xml` for unsupported XML views. (Android widgets only support basic views like `TextView`, `ImageView`, `Button`, `ProgressBar`, `LinearLayout`, `RelativeLayout`).

## 2. Widget Does Not Update Progress After Logging Water in App

### Symptom
Logged 500ml in React Native app, but home screen widget still shows previous intake.

### Solution
- Ensure `WaterCowWidgetModule.updateWidget()` is called after dispatching `ADD_WATER` action in `HydrationContext.tsx`.
- Check if native `SharedPreferences` write succeeded in `WaterCowWidgetHelper.kt`.
