---
sidebar_position: 5
title: Native Code
---

# Native Kotlin Code

All native Kotlin files in `android/app/src/main/java/com/watercow/app/`.

## WaterCowWidgetProvider.kt

The core widget logic. Extends Android's `AppWidgetProvider` to manage the home screen widget lifecycle.

### Key Methods

| Method | When It Runs | What It Does |
|--------|-------------|-------------|
| `onUpdate()` | System widget refresh (every 30 min) | Rebuilds RemoteViews from SharedPreferences data |
| `onReceive()` | Any broadcast received | Handles `ACTION_QUICK_ADD_WATER` and `APPWIDGET_UPDATE` |

### How It Builds the Widget UI

```kotlin
override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
    for (appWidgetId in appWidgetIds) {
        val views = RemoteViews(context.packageName, R.layout.watercow_widget)

        // Read data from SharedPreferences
        val prefs = context.getSharedPreferences("WaterCowWidgetPrefs", Context.MODE_PRIVATE)
        val consumed = prefs.getInt("consumed_ml", 0)
        val goal = prefs.getInt("goal_ml", 2000)

        // Update text views
        views.setTextViewText(R.id.widget_liters_text, formatLiters(consumed))
        views.setTextViewText(R.id.widget_goal_subtext, "of ${formatLiters(goal)} Goal (${percent}%)")
        views.setProgressBar(R.id.widget_progress_bar, 100, percent, false)

        // Set click action to open the app
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("watercow://"))
        views.setOnClickPendingIntent(R.id.widget_root, PendingIntent.getActivity(...))

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}
```

### Quick Add Handling

```kotlin
override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == "com.watercow.app.ACTION_QUICK_ADD_WATER") {
        val prefs = context.getSharedPreferences("WaterCowWidgetPrefs", Context.MODE_PRIVATE)
        val pending = prefs.getInt("pending_quick_adds", 0)
        prefs.edit().putInt("pending_quick_adds", pending + 1).apply()

        // Update widget display immediately (optimistic)
        val consumed = prefs.getInt("consumed_ml", 0)
        prefs.edit().putInt("consumed_ml", consumed + 250).apply()
        updateAllWidgets(context)
    }
}
```

---

## WaterCowWidgetModule.kt

A React Native `NativeModule` that provides a bridge from JavaScript to the widget system.

### Exposed Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `updateWidget` | `consumedMl: Int, goalMl: Int` | Writes data to SharedPreferences and refreshes all widgets |
| `getQuickAddCount` | — | Returns the pending quick-add count from the widget |
| `resetQuickAddCount` | — | Resets the pending count to 0 |

### Calling from JavaScript

```typescript
// utils/widget.ts
import { NativeModules } from 'react-native';

export async function updateNativeWidget(consumedMl: number, goalMl: number) {
  await NativeModules.WaterCowWidget?.updateWidget(consumedMl, goalMl);
}

export async function getWidgetQuickAddCount(): Promise<number> {
  return NativeModules.WaterCowWidget?.getQuickAddCount() ?? 0;
}
```

---

## WaterCowWidgetHelper.kt

A utility class for SharedPreferences operations. Centralizes the preference file name and key constants.

---

## WaterCowWidgetPackage.kt

Implements `ReactPackage` to register `WaterCowWidgetModule` and `WaterCowNotificationModule` with React Native.

```kotlin
class WaterCowWidgetPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            WaterCowWidgetModule(reactContext),
            WaterCowNotificationModule(reactContext),
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext) = emptyList<ViewManager<*, *>>()
}
```

This package is registered in `MainApplication.kt`.

---

## WaterCowNotificationModule.kt

A `NativeModule` for creating Android notification channels with custom sounds.

### Exposed Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `createNotificationChannel` | `channelId, channelName, soundFileName` | Creates a channel with the specified sound from `res/raw/` |
| `deleteNotificationChannel` | `channelId` | Deletes a channel |

### Why Native?

Notification channels can be created via `expo-notifications`, but referencing custom sound files from `res/raw/` requires a native `Uri`:

```kotlin
val soundUri = Uri.parse("android.resource://${context.packageName}/raw/$soundFileName")
channel.setSound(soundUri, audioAttributes)
```

This URI format (`android.resource://package/raw/filename`) is only available in native Android code.
