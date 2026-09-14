---
sidebar_position: 6
title: Architecture Decisions
---

# Architecture Decisions

This page explains **why** each technology was chosen for the Water Cow project.

## Why React Native?

React Native lets you build native mobile apps using JavaScript/TypeScript and React. For Water Cow:
- **Single codebase** for potential iOS and Android support (currently Android-focused)
- **Hot reload** during development — change code, see it instantly on device
- **Large ecosystem** of libraries for navigation, storage, notifications, animation
- **Native performance** — React Native renders real native views, not a WebView

The tradeoff: features that touch the Android OS directly (home screen widgets, custom notification sounds) must be written in native Kotlin code.

## Why Expo (SDK 57)?

Expo is a managed workflow and module system built on top of React Native.

- **Pre-built modules** — `expo-notifications`, `expo-file-system`, `expo-audio`, etc. work out of the box
- **Simplified build system** — `npx expo run:android` handles Gradle, Metro, and native linking
- **EAS Build** — Cloud builds without local Android SDK setup
- **Config plugins** — Declare native configurations in `app.json` instead of editing XML files manually

Without Expo, you'd need to manually configure each native dependency's Gradle files, AndroidManifest entries, and resource files.

## Why TypeScript?

TypeScript adds static types to JavaScript:
- **Catches bugs at compile time** — misspelled property names, wrong function arguments
- **Better editor support** — autocomplete for every function, prop, and interface
- **Self-documenting** — interfaces like `WaterEntry`, `ReminderSettings`, and `UserProfile` serve as documentation

The project uses `strict: true` for maximum type safety.

## Why Context + useReducer (instead of Redux/Zustand)?

Water Cow has a simple state model (entries, profile, settings, history). Using React's built-in tools:
- **Zero extra dependencies** — no Redux, no middleware, no store configuration
- **Simpler mental model** — dispatch an action, reducer returns new state
- **Sufficient for this app** — ~8 state fields, ~9 action types, 1 reducer

If the app grew significantly (hundreds of state fields, complex async flows), migrating to Zustand or Redux would be straightforward.

## Why AsyncStorage?

AsyncStorage is a simple key-value store that persists data to the device:
- **No database needed** — the data model is simple (daily entries, user preferences)
- **JSON serialization** — store and retrieve JavaScript objects easily
- **Standard for React Native** — well-maintained, Expo-compatible
- **90-day rolling history** — the app keeps the last 90 days, so data volume stays small

For a hydration tracker with one user and local-only data, AsyncStorage is the right choice. A SQLite database would add complexity without benefit.

## Why Expo Notifications (instead of Firebase Cloud Messaging)?

Water Cow uses **local** notifications only — reminders scheduled at specific times, not pushed from a server:
- **No server required** — notifications are scheduled entirely on-device
- **Custom sounds** — expo-notifications supports Android notification channels with custom sound files
- **Versioned channels** — the app manages channel lifecycle to work around Android's immutable channel settings

Firebase Cloud Messaging would be needed for server-pushed notifications, which Water Cow doesn't use.

## Why Android Notification Channels?

Since Android 8 (API 26), all notifications **must** be assigned to a channel. Channels control:
- Sound
- Vibration pattern
- Importance level
- LED color

Water Cow creates separate channels for each sound option (cow moo, cow bell, default) because **Android does not allow changing a channel's settings after creation**. The versioned channel ID pattern (`water_reminders_moo_v8`) ensures new sound configurations are applied by creating new channels.

## Why Native Kotlin for the Widget?

React Native cannot render Android home screen widgets because:
- Widgets use **RemoteViews**, a restricted subset of Android views
- Widgets run in a separate process from the app
- Widgets are managed by the Android launcher, not by your app's activity

Therefore, the widget is written in native Kotlin using `AppWidgetProvider`. It shares data with the React Native app through `SharedPreferences`, which both sides can read/write.

## Why Not Jetpack Glance?

The project has Glance dependencies in `build.gradle`, but the widget is built with the traditional `AppWidgetProvider` + `RemoteViews` approach:
- **Simpler** — RemoteViews is straightforward for a simple progress display
- **More control** — Direct XML layout with exact positioning
- **Better documented** — More resources available for traditional widgets
- **Glance is newer** — Less battle-tested; the traditional approach is proven

## Why Hermes Engine?

Hermes is Meta's JavaScript engine optimized for React Native:
- **Faster startup** — Ahead-of-time compilation
- **Lower memory usage** — Optimized garbage collector
- **Smaller bundle** — Bytecode is smaller than JavaScript source
- **Enabled by default** — Standard for modern React Native + Expo projects

The project enables Hermes via `hermesEnabled=true` in `gradle.properties`.

## Why New Architecture?

The project enables React Native's New Architecture (`newArchEnabled=true`):
- **Fabric renderer** — Synchronous, more efficient UI rendering
- **TurboModules** — Lazy-loaded native modules with direct JSI bridge
- **Better performance** — Reduced bridge overhead

This is the modern default for Expo SDK 57 + React Native 0.86.

## Why Local-Only (No Backend)?

Water Cow is designed as a fully offline app:
- **Privacy** — No personal health data leaves the device
- **Simplicity** — No server infrastructure to maintain
- **Reliability** — Works without internet
- **Speed** — No network latency

If cloud sync were needed in the future, it could be added as an optional layer on top of the existing local storage.
