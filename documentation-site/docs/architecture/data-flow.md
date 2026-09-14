---
sidebar_position: 3
title: Data Flow
---

# Data Flow

This page explains how data moves through the Water Cow app when a user performs common actions.

## Adding Water

The most frequent user action — tapping "+250 ml" on the home screen.

```mermaid
sequenceDiagram
    participant User
    participant HomeScreen
    participant HydrationContext
    participant Reducer
    participant AsyncStorage
    participant WidgetModule
    participant SharedPrefs
    participant AndroidWidget

    User->>HomeScreen: Tap "+250 ml"
    HomeScreen->>HydrationContext: addWater(250)
    HydrationContext->>Reducer: dispatch({type: 'ADD_WATER', amount: 250})
    Reducer-->>HydrationContext: New state (entries + totalConsumed updated)

    Note over HydrationContext: useEffect triggers on state.entries change

    HydrationContext->>AsyncStorage: saveTodayEntries(entries)
    HydrationContext->>AsyncStorage: saveDayData({date, total, goal, entries})
    HydrationContext->>WidgetModule: updateNativeWidget(totalConsumed, dailyGoal)
    WidgetModule->>SharedPrefs: Write consumed_ml, goal_ml, date_key
    WidgetModule->>AndroidWidget: updateAllWidgets()
    AndroidWidget-->>User: Widget display updated

    HydrationContext-->>HomeScreen: Re-render
    HomeScreen-->>User: Progress ring, stats, cow mood updated
```

## App Startup

When the app launches, it loads all persisted data and syncs any pending widget quick-adds.

```mermaid
sequenceDiagram
    participant App
    participant HydrationContext
    participant AsyncStorage
    participant NotificationSystem
    participant WidgetModule

    App->>HydrationContext: Mount (useEffect)
    HydrationContext->>AsyncStorage: loadTodayEntries()
    HydrationContext->>AsyncStorage: loadProfile()
    HydrationContext->>AsyncStorage: loadReminderSettings()
    HydrationContext->>AsyncStorage: loadHistory()
    AsyncStorage-->>HydrationContext: Entries, profile, settings, history

    HydrationContext->>HydrationContext: dispatch LOAD_DATA
    HydrationContext->>NotificationSystem: scheduleReminders(settings)

    HydrationContext->>WidgetModule: checkAndSyncWidgetQuickAdds()
    WidgetModule-->>HydrationContext: pendingCount (quick adds from widget)
    
    alt pendingCount > 0
        HydrationContext->>HydrationContext: dispatch ADD_WATER (250 × count)
    end
```

## Storage Structure

All data is stored as JSON strings in AsyncStorage with these keys:

```mermaid
graph LR
    AS[(AsyncStorage)]
    AS --> |watercow_entries_YYYY-MM-DD| E[Today's Water Entries]
    AS --> |watercow_profile| P[User Profile]
    AS --> |watercow_settings| S[Reminder Settings]
    AS --> |watercow_history| H[Last 90 Days History]
    AS --> |watercow_theme_mode| T[Theme Preference]

    style AS fill:#F3E5F5,stroke:#9C27B0
```

| Key Pattern | Value | Example |
|------------|-------|---------|
| `watercow_entries_2026-09-14` | `WaterEntry[]` | `[{id, amount: 250, timestamp}]` |
| `watercow_profile` | `UserProfile` | `{name: "Buddy", unit: "ml", dailyGoal: 2000}` |
| `watercow_settings` | `ReminderSettings` | `{enabled: true, intervalMinutes: 60, sound: "cow_moo", ...}` |
| `watercow_history` | `DayData[]` | Last 90 days, sorted newest first |
| `watercow_theme_mode` | `string` | `"system"`, `"light"`, or `"dark"` |

## Widget Data Sync

The React Native app and the native Android widget share data through **Android SharedPreferences**, not AsyncStorage.

```mermaid
graph LR
    RN[React Native App] -->|NativeModules.WaterCowWidget.updateWidget| WM[WaterCowWidgetModule.kt]
    WM -->|Write| SP[(SharedPreferences: WaterCowWidgetPrefs)]
    WM -->|Trigger| WP[WaterCowWidgetProvider.kt]
    WP -->|Read| SP
    WP -->|Render| RV[RemoteViews → Android Launcher]

    RV -->|User taps widget body| RN
    RV -->|Quick add action| QA[onReceive ACTION_QUICK_ADD_WATER]
    QA -->|Write pending_quick_adds| SP
    RN -->|On next app open| SYNC[checkAndSyncWidgetQuickAdds]
    SYNC -->|Read & reset pending_quick_adds| SP

    style SP fill:#F3E5F5,stroke:#9C27B0
```

### SharedPreferences Keys (Widget)

| Key | Type | Description |
|-----|------|-------------|
| `consumed_ml` | `Int` | Milliliters consumed today |
| `goal_ml` | `Int` | Daily goal in milliliters (default: 2000) |
| `date_key` | `String` | Today's date (`YYYY-MM-DD`) — resets consumption on new day |
| `pending_quick_adds` | `Int` | Number of quick-add taps from widget awaiting sync |
