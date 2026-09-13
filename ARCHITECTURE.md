# 🐄 Water Cow — Architecture & Beginner Guide

> A comprehensive guide for the Water Cow app, written for developers who are new to React Native and mobile app development. If you come from a Java/Spring background, you'll find helpful comparisons throughout.

---

## Table of Contents

1. [What is Water Cow?](#what-is-water-cow)
2. [Technology Stack](#technology-stack)
3. [How React Native & Expo Work](#how-react-native--expo-work)
4. [Project Structure](#project-structure)
5. [Key Features](#key-features)
6. [Dependencies Explained](#dependencies-explained)
7. [Architecture Diagram](#architecture-diagram)
8. [Key Concepts for Java Developers](#key-concepts-for-java-developers)
9. [How to Develop](#how-to-develop)
10. [How to Build & Generate APK](#how-to-build--generate-apk)
11. [How to Reduce App Size](#how-to-reduce-app-size)
12. [Troubleshooting](#troubleshooting)

---

## What is Water Cow?

Water Cow is a **daily water intake tracker** for Android (and potentially iOS). It features:

- 🐄 An animated cow mascot whose mood changes based on your hydration
- 💧 Log water intake with quick-add buttons or custom amounts
- 📊 Track daily progress with a progress ring and stats cards
- ⏰ Smart reminders with custom sounds (cow moo, cow bell)
- 📱 Android home screen widget showing live water stats
- 📅 History view with 7-day and 30-day charts
- 🌙 Light/Dark/System theme support
- 💾 Backup/Restore data via JSON export

---

## Technology Stack

| Technology | What It Does | Java/Spring Equivalent |
|-----------|-------------|----------------------|
| **React Native** | Cross-platform mobile UI framework | Like JavaFX or Android SDK |
| **Expo SDK 57** | Toolchain & managed libraries for React Native | Like Spring Boot (provides conventions + pre-built modules) |
| **TypeScript** | JavaScript with static types | Like Java's type system |
| **React** | Component-based UI library | Like Thymeleaf templates but reactive |
| **expo-router** | File-based navigation | Like Spring MVC `@RequestMapping` |
| **AsyncStorage** | Local key-value persistence | Like SharedPreferences or H2 embedded DB |
| **expo-notifications** | Push & local notifications | Like a scheduled task service |
| **Kotlin** | Native Android code (for widget) | You know this! Native Android |

---

## How React Native & Expo Work

### React Native vs Native Android

```
┌─────────────────────────────────────────────┐
│              Your App Code                  │
│         (TypeScript / React)                │
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │  Home   │  │ History │  │Settings │     │
│  │ Screen  │  │ Screen  │  │ Screen  │     │
│  └────┬────┘  └────┬────┘  └────┬────┘     │
│       │            │            │           │
│  ┌────┴────────────┴────────────┴────┐      │
│  │       React Native Bridge         │      │
│  └────┬────────────┬────────────┬────┘      │
│       │            │            │           │
│  ┌────┴────┐  ┌────┴────┐  ┌───┴─────┐     │
│  │ Native  │  │ Native  │  │ Native  │     │
│  │  Views  │  │  APIs   │  │  Code   │     │
│  │(Android)│  │(Notifs) │  │(Widget) │     │
│  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────┘
```

**Key Idea**: You write UI code once in TypeScript/React. React Native translates it to **native Android Views** (not a WebView). When you write `<Text>`, it becomes a native `android.widget.TextView`.

### What is Expo?

Expo is like **Spring Boot for mobile apps**. Just as Spring Boot gives you:
- Auto-configuration
- Pre-built starters (spring-boot-starter-web, etc.)
- A CLI to run/build
- Convention over configuration

Expo gives you:
- Pre-configured build system (no Gradle/Xcode setup needed usually)
- Pre-built modules (`expo-notifications`, `expo-file-system`, etc.)
- A CLI (`npx expo start`, `npx expo run:android`)
- A managed workflow that handles most native configuration

### Expo Go vs Dev Build vs Production Build

This is **critical** to understand:

| Mode | What It Is | Native Code? | Use For |
|------|-----------|-------------|---------|
| **Expo Go** | Pre-built app you download from Play Store, scan QR to load your JS | ❌ No custom native code | Quick UI prototyping only |
| **Dev Build** | Full app compiled from your source, with dev tools | ✅ Yes | Development & testing |
| **Production** | Optimized release APK/AAB | ✅ Yes | Distribution to users |

> ⚠️ **The Android widget and custom notification sounds ONLY work in Dev Build or Production**, never in Expo Go, because they require native Kotlin code and `res/raw/` audio files.

---

## Project Structure

```
WaterCow/
├── app/                          # 📱 Screens (file-based routing)
│   ├── _layout.tsx               #    Root layout (providers, fonts)
│   └── (tabs)/                   #    Tab-based navigation
│       ├── _layout.tsx           #    Tab bar configuration
│       ├── index.tsx             #    🏠 Home Screen (dashboard)
│       ├── add.tsx               #    ➕ Add Water Screen
│       ├── history.tsx           #    📊 History & Charts Screen
│       ├── reminders.tsx         #    ⏰ Reminder Settings Screen
│       └── settings.tsx          #    ⚙️ App Settings Screen
│
├── components/                   # 🧩 Reusable UI Components
│   ├── cow/                      #    Cow mascot components
│   │   ├── CowAnimated.tsx       #    Animated cow for home screen
│   │   ├── CowMascot.tsx         #    Static cow SVG drawing
│   │   └── CowReminderAnimated.tsx  # Animated cow for reminders page
│   └── ui/                       #    General UI components
│       ├── BarChart.tsx           #    History bar chart
│       ├── Card.tsx              #    Reusable card wrapper
│       ├── GlassWaterView.tsx    #    Animated water glass
│       ├── HomeScreenWidgetModal.tsx  # Widget setup modal
│       ├── PillButton.tsx        #    Pill-shaped selector button
│       ├── ProgressRing.tsx      #    Circular progress indicator
│       ├── SegmentedControl.tsx  #    Tab-like segmented control
│       ├── StatsCard.tsx         #    Stat display card
│       └── WallpaperWidgetModal.tsx  # Wallpaper export modal
│
├── constants/                    # 📐 Design Tokens & Constants
│   ├── cowMoods.ts               #    Cow mood calculation logic
│   └── theme.ts                  #    Colors, typography, spacing
│
├── context/                      # 🔄 Global State (like a service layer)
│   ├── HydrationContext.tsx      #    Main app state + actions
│   └── ThemeContext.tsx          #    Theme/dark mode state
│
├── utils/                        # 🔧 Utility Functions (like a utils package)
│   ├── backup.ts                 #    Export/import data as JSON
│   ├── hydration.ts              #    Formatting, date, time helpers
│   ├── notifications.ts         #    Notification scheduling
│   ├── storage.ts               #    AsyncStorage read/write
│   └── widget.ts                #    Native widget bridge
│
├── assets/                       # 🎨 Static Assets
│   ├── sounds/                   #    Audio files for notifications
│   │   ├── cow_bell.mp3
│   │   └── cow_moo.mp3
│   ├── icon.png                  #    App icon
│   └── splash-icon.png          #    Splash screen icon
│
├── android/                      # 🤖 Native Android Code
│   └── app/src/main/
│       ├── AndroidManifest.xml   #    App permissions & widget registration
│       ├── java/.../             #    Kotlin source files
│       │   ├── MainActivity.kt
│       │   ├── MainApplication.kt
│       │   ├── WaterCowWidgetProvider.kt  # Widget logic
│       │   ├── WaterCowWidgetModule.kt    # JS→Native bridge
│       │   └── WaterCowWidgetPackage.kt   # RN package
│       └── res/                  #    Android resources
│           ├── layout/watercow_widget.xml  # Widget UI
│           ├── drawable/         #    Widget backgrounds
│           ├── raw/              #    Sound files for notifications
│           └── xml/watercow_widget_info.xml  # Widget metadata
│
├── app.json                      # ⚙️ Expo config (like application.yml)
├── eas.json                      # 🏗️ EAS Build config (like Maven profiles)
├── package.json                  # 📦 Dependencies (like pom.xml)
├── tsconfig.json                 # TypeScript config
└── index.ts                      # Entry point
```

### Java/Spring Comparison

| React Native Concept | Java/Spring Equivalent |
|----------------------|----------------------|
| `app/` (screens) | `@Controller` classes with templates |
| `components/` | Reusable UI partials / Thymeleaf fragments |
| `context/` | `@Service` classes (business logic + state) |
| `utils/` | Utility classes (`StringUtils`, `DateUtils`) |
| `constants/` | `Constants.java` / `application.properties` |
| `app.json` | `application.yml` |
| `package.json` | `pom.xml` / `build.gradle` |
| `eas.json` | Maven profiles / CI/CD config |

---

## Key Features

### 1. State Management (HydrationContext)

The app uses React's **Context + useReducer** pattern, which is like a lightweight Redux:

```
User taps "+250ml"
    → dispatch({ type: 'ADD_WATER', amount: 250 })
    → reducer updates state (entries, totalConsumed, etc.)
    → all components re-render with new data
    → side effects: save to AsyncStorage, update widget
```

**Java equivalent**: This is like a **singleton service** with an event-driven state machine:
```java
// Java equivalent concept
@Service
public class HydrationService {
    private HydrationState state;
    
    public void addWater(int amount) {
        state = state.withNewEntry(amount);
        repository.save(state);
        widgetService.update(state);
        notifyListeners();
    }
}
```

### 2. File-Based Routing (expo-router)

Files in `app/` automatically become routes:

| File | Route |
|------|-------|
| `app/(tabs)/index.tsx` | Home tab (default `/`) |
| `app/(tabs)/add.tsx` | Add water tab (`/add`) |
| `app/(tabs)/history.tsx` | History tab (`/history`) |
| `app/(tabs)/reminders.tsx` | Reminders tab (`/reminders`) |
| `app/(tabs)/settings.tsx` | Settings tab (`/settings`) |

The `(tabs)` folder groups them into a tab navigator (the bottom tab bar).

**Java equivalent**: Like `@RequestMapping("/history")` in Spring MVC, but automatic.

### 3. AsyncStorage (Local Persistence)

AsyncStorage is a simple key-value store that persists data on the device:

```typescript
// Save
await AsyncStorage.setItem('key', JSON.stringify(data));

// Load
const data = await AsyncStorage.getItem('key');
```

**Java equivalent**: Like `SharedPreferences` on Android or an embedded H2 database.

### 4. Native Android Widget

The home screen widget is written in **Kotlin** (native Android) because React Native cannot render native home screen widgets. The architecture is:

```
React Native App  ←→  WaterCowWidgetModule (Bridge)  ←→  WaterCowWidgetProvider (Native)
                          ↕                                    ↕
                   SharedPreferences                    RemoteViews (Widget UI)
```

### 5. Notification System

Notifications use Android **Notification Channels** (required since Android 8):

```
User selects "Cow Moo" sound
    → Creates channel "water_reminders_moo_v3" with cow_moo sound
    → Schedules notifications on that channel
    → Android plays the channel's sound when notification fires
```

> **Important**: On Android, the CHANNEL controls the sound, not the individual notification. And channels are IMMUTABLE once created — you cannot change their settings. You must create a new channel with a new ID.

---

## Dependencies Explained

### Core Framework

| Package | Version | What It Does |
|---------|---------|-------------|
| `react` | 19.2.3 | UI library — components, hooks, state management |
| `react-native` | 0.86.2 | Translates React components to native mobile views |
| `expo` | ~57.0.15 | Managed workflow, module system, dev tools |

### Navigation

| Package | What It Does |
|---------|-------------|
| `expo-router` | File-based routing — each file in `app/` becomes a screen |
| `react-native-screens` | Native navigation containers (optimized screen rendering) |
| `react-native-safe-area-context` | Handles notch/status bar insets |

### UI & Animation

| Package | What It Does |
|---------|-------------|
| `react-native-reanimated` | Smooth 60fps animations (cow mascot, progress ring) |
| `react-native-gesture-handler` | Touch gestures (swipe, long-press) |
| `react-native-svg` | SVG rendering for the cow mascot and progress ring |
| `@expo/vector-icons` | Feather icon set (droplet, bell, settings icons) |
| `@expo-google-fonts/inter` | Inter font family for clean typography |
| `react-native-worklets` | Threading support for Reanimated animations |

### Data & Storage

| Package | What It Does |
|---------|-------------|
| `@react-native-async-storage/async-storage` | Local key-value persistence (like SharedPreferences) |
| `expo-file-system` | Read/write files for backup export |
| `expo-document-picker` | File picker dialog for backup import |
| `expo-sharing` | Share files via Android share sheet |

### Notifications & Audio

| Package | What It Does |
|---------|-------------|
| `expo-notifications` | Schedule local notifications with custom sounds |
| `expo-audio` | Play sound previews in the app |
| `expo-asset` | Bundle and load static assets (sounds, images) |

### System

| Package | What It Does |
|---------|-------------|
| `expo-splash-screen` | Splash/loading screen on app launch |
| `expo-status-bar` | Control status bar appearance |
| `expo-linking` | Deep linking (watercow:// URL scheme) |
| `expo-constants` | Access app metadata (version, etc.) |

### Dev Dependencies

| Package | What It Does |
|---------|-------------|
| `typescript` | TypeScript compiler |
| `@types/react` | TypeScript type definitions for React |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    User Interface                    │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐  │
│  │  Home    │ │  Add     │ │History │ │Reminders │  │
│  │  Screen  │ │  Screen  │ │ Screen │ │  Screen  │  │
│  └────┬─────┘ └────┬─────┘ └───┬────┘ └────┬─────┘  │
│       │            │           │            │        │
│  ┌────┴────────────┴───────────┴────────────┴────┐   │
│  │              Reusable Components              │   │
│  │  (ProgressRing, StatsCard, CowAnimated, ...)  │   │
│  └───────────────────┬───────────────────────────┘   │
│                      │                               │
│  ┌───────────────────┴───────────────────────────┐   │
│  │           Context Layer (Global State)         │   │
│  │  ┌──────────────────┐  ┌──────────────────┐   │   │
│  │  │ HydrationContext │  │  ThemeContext     │   │   │
│  │  │  (water data,    │  │  (dark/light,    │   │   │
│  │  │   cow mood,      │  │   color scheme)  │   │   │
│  │  │   reminders)     │  │                  │   │   │
│  │  └────────┬─────────┘  └──────────────────┘   │   │
│  └───────────┼───────────────────────────────────┘   │
│              │                                       │
│  ┌───────────┴───────────────────────────────────┐   │
│  │              Utilities Layer                   │   │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────────┐  │   │
│  │  │ storage  │ │ notifi-   │ │  hydration   │  │   │
│  │  │ .ts      │ │ cations.ts│ │  .ts         │  │   │
│  │  └──────────┘ └───────────┘ └──────────────┘  │   │
│  │  ┌──────────┐ ┌───────────┐                   │   │
│  │  │ widget   │ │ backup    │                   │   │
│  │  │ .ts      │ │ .ts       │                   │   │
│  │  └──────────┘ └───────────┘                   │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │           Native / Platform Layer              │   │
│  │  ┌──────────────┐  ┌───────────────────────┐   │   │
│  │  │ AsyncStorage │  │ Android Widget        │   │   │
│  │  │ (SQLite)     │  │ (Kotlin native code)  │   │   │
│  │  └──────────────┘  └───────────────────────┘   │   │
│  │  ┌──────────────┐  ┌───────────────────────┐   │   │
│  │  │ expo-notifs  │  │ expo-audio             │   │   │
│  │  │ (Android     │  │ (MediaPlayer)         │   │   │
│  │  │  channels)   │  │                       │   │   │
│  │  └──────────────┘  └───────────────────────┘   │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Key Concepts for Java Developers

### Components = Classes with a render method

```typescript
// React Native (this app)
export function StatsCard({ icon, value, label }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <Text>{value}</Text>
      <Text>{label}</Text>
    </View>
  );
}
```

```java
// Java Swing equivalent concept
public class StatsCard extends JPanel {
    public StatsCard(String icon, String value, String label) {
        add(new JLabel(value));
        add(new JLabel(label));
    }
}
```

### Hooks = Lifecycle Methods

| React Hook | Java Equivalent |
|-----------|----------------|
| `useState` | Instance variable with setter |
| `useEffect` | `@PostConstruct` + event listeners |
| `useContext` | `@Autowired` dependency injection |
| `useReducer` | State machine / event sourcing |
| `useMemo` | Cached computed property |
| `useCallback` | Method reference caching |

### StyleSheet = CSS-in-JS

```typescript
// React Native
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
  },
});
```

This is like inline CSS but defined as JavaScript objects. There are no CSS files — styles live with the component.

### Navigation = Tab Activity

The app uses a **tab navigator** (bottom tab bar). In Android terms:
- `_layout.tsx` in `(tabs)/` = `BottomNavigationView` activity
- Each screen file = a `Fragment`

---

## How to Develop

### Prerequisites

1. **Node.js** (v18+ recommended): https://nodejs.org/
2. **Android Studio** (for Android SDK & emulator): https://developer.android.com/studio
3. **JDK 17** (you likely already have this as a Java developer)

### First-Time Setup

```bash
# 1. Clone the project (if not done)
git clone <your-repo-url>
cd WaterCow

# 2. Install JavaScript dependencies
npm install

# 3. Generate the native android/ code (if needed)
npx expo prebuild --platform android

# 4. Run on connected Android device or emulator
npx expo run:android
```

### Daily Development Workflow

```bash
# Start the development server
npx expo start

# If you changed ONLY TypeScript/React code:
#   → The app hot-reloads automatically (no rebuild needed!)

# If you changed native Android code (Kotlin, XML, AndroidManifest):
#   → You MUST rebuild:
npx expo run:android
```

### Key Commands

| Command | What It Does |
|---------|-------------|
| `npx expo start` | Start the Metro bundler (JS dev server) |
| `npx expo run:android` | Build & run on Android device/emulator |
| `npx expo prebuild` | Generate native `android/` and `ios/` directories |
| `npx expo install <package>` | Install a package (auto-selects compatible version) |
| `eas build --platform android` | Cloud build via Expo Application Services |

### Hot Reload vs Full Rebuild

| Changed... | What To Do |
|-----------|-----------|
| `.tsx` / `.ts` files | Nothing — auto hot-reloads |
| `app.json` | Restart Metro (`npx expo start`) |
| `package.json` (new dependency) | `npm install` → restart Metro |
| Kotlin/Java files | `npx expo run:android` (full rebuild) |
| `AndroidManifest.xml` | `npx expo run:android` (full rebuild) |
| `res/` XML or drawable files | `npx expo run:android` (full rebuild) |
| `eas.json` | Only affects cloud builds |

---

## How to Build & Generate APK

### Option 1: Local Build (Debug APK)

```bash
# Build a debug APK locally
npx expo run:android --variant release
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Option 2: EAS Build (Recommended)

EAS (Expo Application Services) builds your app in the cloud. This is the standard way to generate production APKs.

```bash
# 1. Install EAS CLI (one-time)
npm install -g eas-cli

# 2. Log in to your Expo account
eas login

# 3. Build a preview APK (for testing)
eas build --profile preview --platform android

# 4. Build a production AAB (for Play Store)
eas build --profile production --platform android
```

### eas.json Configuration

The current `eas.json` has minimal config. Here's an optimized version:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk",
        "distribution": "internal"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

| Profile | Output | Size | Use Case |
|---------|--------|------|----------|
| `preview` | `.apk` | ~20-30MB | Direct install on your phone |
| `production` | `.aab` | ~15-20MB | Upload to Google Play Store |

### Installing the APK

```bash
# After EAS build completes, download the APK, then:
adb install path/to/app-preview.apk

# Or just tap the downloaded APK file on your phone
```

---

## How to Reduce App Size

### Why is the Expo Go / Debug Build 114MB?

The debug build includes everything needed for development:

| Component | Debug | Production |
|-----------|-------|-----------|
| JavaScript bundle | ~8MB (unminified) | ~2MB (minified + tree-shaken) |
| Hermes engine | ~12MB (with debug symbols) | ~4MB (optimized) |
| React Native libraries | ~40MB (all arch: arm64, armeabi-v7a, x86, x86_64) | ~10MB (arm64-v8a only) |
| Expo modules | ~30MB (all included) | ~10MB (only used ones) |
| Dev tools (inspector, etc.) | ~10MB | 0MB |
| Source maps | ~10MB | 0MB |
| **Total** | **~110-120MB** | **~20-30MB** |

### Steps to Reduce Size

#### 1. Build in Production Mode (biggest impact)

```bash
# This alone drops size from ~114MB to ~25-30MB
eas build --profile preview --platform android
```

#### 2. Target Only arm64 Architecture

Modern Android phones (99%+) use arm64. Add to `app.json`:

```json
{
  "expo": {
    "android": {
      "buildProperties": {
        "android.defaultConfig.ndk.abiFilters": "arm64-v8a"
      }
    }
  }
}
```

This removes x86, x86_64, and armeabi-v7a libraries (saves ~15-20MB).

> ⚠️ Only do this for production builds. Keep all architectures for emulator testing (x86_64 is needed for emulators).

#### 3. Enable ProGuard/R8 (Code Shrinking)

Already enabled by default in production builds. Verify in `android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
    }
}
```

#### 4. Optimize Images

Your `assets/` folder has some large images:

| File | Size | Action |
|------|------|--------|
| `cowfavi.png` | 961KB | Compress or resize (not used in app?) |
| `icon.png` | 393KB | Already adaptive, OK |
| `waterCowFav.jpg` | 136KB | Check if used |
| `android-icon-foreground.png` | 78KB | OK |

Use [TinyPNG](https://tinypng.com/) to compress PNGs without quality loss.

#### 5. Remove the Gradle ZIP from the Repo

There's a `android/gradle-9.3.1-bin.zip` (137MB!) checked into the repo. This is a **build tool artifact** that should NOT be in your source code. The Gradle wrapper downloads it automatically.

```bash
# Remove it from the repository
git rm android/gradle-9.3.1-bin.zip
```

> This won't reduce the APK size but will make your repository much smaller.

### Expected Size After Optimization

| Build Type | Expected Size |
|-----------|--------------|
| Debug (current) | ~114MB |
| EAS Preview APK | ~25-30MB |
| EAS Production AAB | ~15-20MB |
| Play Store download (AAB) | ~10-15MB |

---

## Troubleshooting

### Widget Not Showing

1. **Are you using Expo Go?** The widget needs native code → use `npx expo run:android`
2. **Did you rebuild?** After changing Kotlin/XML → `npx expo run:android`
3. **Search carefully**: Long-press home → Widgets → type "Water" in search
4. **Check channel settings**: Settings → Apps → Water Cow → Notifications → ensure channels exist

### Custom Sound Not Playing

1. **First time?** After a fresh build, open the app once to let it create notification channels
2. **Old channels cached?** Go to Settings → Apps → Water Cow → Notifications → delete old "Water Reminders" channels
3. **Volume up?** Make sure notification volume is not muted
4. **DND off?** Disable Do Not Disturb mode

### "Cannot find module" Errors

```bash
# Clear caches and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Build Fails

```bash
# Clean native build cache
cd android && ./gradlew clean && cd ..
npx expo run:android
```

### "Invariant Violation: No callback found"

This usually means a native module isn't properly linked. Rebuild:
```bash
npx expo prebuild --clean
npx expo run:android
```

---

## Quick Reference Card

| I want to... | Command |
|-------------|---------|
| Start developing | `npx expo start` |
| Run on my phone | `npx expo run:android` |
| Install a new library | `npx expo install <package-name>` |
| Build a test APK | `eas build --profile preview --platform android` |
| Build for Play Store | `eas build --profile production --platform android` |
| See app logs | `npx react-native log-android` |
| Clear all caches | `npx expo start --clear` |
| Check what's installed | `npx expo-doctor` |

---

*Last updated: August 2026 • Water Cow v1.0.0 • Expo SDK 57 • React Native 0.86*
