---
sidebar_position: 2
title: Folder Structure
---

# Folder Structure

Every file and directory in the Water Cow project, explained.

```
WaterCow/
├── app/                              # 📱 Screens (file-based routing)
│   ├── _layout.tsx                   #    Root layout — font loading, providers, splash screen
│   ├── +html.tsx                     #    HTML wrapper for web builds
│   └── (tabs)/                       #    Tab navigator group
│       ├── _layout.tsx               #    Tab bar configuration (5 tabs, Feather icons)
│       ├── index.tsx                 #    🏠 Home — progress ring, cow, stats, quick-add
│       ├── add.tsx                   #    ➕ Add Water — glass animation, custom amounts
│       ├── history.tsx               #    📊 History — 7d/30d bar charts, daily detail
│       ├── reminders.tsx             #    ⏰ Reminders — interval, schedule, sound picker
│       └── settings.tsx              #    ⚙️ Settings — profile, theme, goal, backup
│
├── components/                       # 🧩 Reusable UI components
│   ├── cow/                          #    Cow mascot family
│   │   ├── CowMascot.tsx             #    Static SVG cow with 5 mood expressions
│   │   ├── CowAnimated.tsx           #    Animated wrapper — idle bobbing + mood transitions
│   │   └── CowReminderAnimated.tsx   #    Advanced animated cow for reminders page
│   └── ui/                           #    General UI components
│       ├── BarChart.tsx              #    SVG bar chart for history
│       ├── Card.tsx                  #    Frosted glass card with 3 variants
│       ├── CustomLaunchScreen.tsx    #    Animated app launch screen
│       ├── GlassWaterView.tsx        #    Animated water glass (fill animation)
│       ├── HomeScreenWidgetModal.tsx  #    Instructions modal for adding widget
│       ├── PillButton.tsx            #    Pill-shaped selector button (3 sizes)
│       ├── ProgressRing.tsx          #    Animated SVG circular progress
│       ├── SegmentedControl.tsx      #    Tab-like segmented control
│       ├── StatsCard.tsx             #    Icon + value + label stat display
│       └── WallpaperWidgetModal.tsx   #    Wallpaper export modal
│
├── constants/                        # 📐 Design tokens and constants
│   ├── cowMoods.ts                   #    CowMood type, mood configs, calculateCowMood()
│   └── theme.ts                      #    Colors, DarkColors, Typography, Spacing, Shadows
│
├── context/                          # 🔄 Global state (React Context + useReducer)
│   ├── HydrationContext.tsx          #    Main state: entries, profile, settings, history
│   └── ThemeContext.tsx              #    Theme mode: light/dark/system
│
├── utils/                            # 🔧 Business logic and platform integration
│   ├── backup.ts                     #    JSON export/import via expo-sharing/document-picker
│   ├── hydration.ts                  #    Date/time formatting, progress helpers
│   ├── notifications.ts             #    Channel management, scheduling, test notifications
│   ├── storage.ts                    #    AsyncStorage CRUD for entries, settings, profile
│   └── widget.ts                     #    NativeModule bridge to Android widget
│
├── assets/                           # 🎨 Static assets
│   ├── favicon.png                   #    App icon image
│   └── sounds/                       #    Notification sound files
│       ├── cow_moo.mp3               #    Cow moo sound (42KB)
│       └── cow_bell.mp3              #    Cow bell sound (68KB)
│
├── android/                          # 🤖 Native Android project
│   ├── app/
│   │   ├── build.gradle              #    App-level Gradle config (SDK versions, deps)
│   │   ├── proguard-rules.pro        #    ProGuard/R8 keep rules
│   │   ├── debug.keystore            #    Debug signing key
│   │   └── src/main/
│   │       ├── AndroidManifest.xml   #    Permissions, activity, widget receiver
│   │       ├── java/com/watercow/app/
│   │       │   ├── MainActivity.kt           # Expo/RN activity
│   │       │   ├── MainApplication.kt        # App entry + package registration
│   │       │   ├── WaterCowWidgetProvider.kt  # AppWidgetProvider (widget logic)
│   │       │   ├── WaterCowWidgetModule.kt    # NativeModule: JS→Kotlin bridge
│   │       │   ├── WaterCowWidgetHelper.kt    # SharedPreferences helper
│   │       │   ├── WaterCowWidgetPackage.kt   # ReactPackage registration
│   │       │   └── WaterCowNotificationModule.kt # Notification channel management
│   │       └── res/
│   │           ├── layout/watercow_widget.xml     # Widget UI layout
│   │           ├── layout/widget_preview.xml      # Widget preview in picker
│   │           ├── xml/watercow_widget_info.xml   # Widget metadata
│   │           ├── drawable/widget_bg.xml         # Widget background gradient
│   │           ├── drawable/widget_progress_bar.xml # Widget progress bar style
│   │           ├── raw/cow_moo.mp3                # Sound for notifications
│   │           └── raw/cow_bell.mp3               # Sound for notifications
│   ├── build.gradle                  #    Project-level Gradle config
│   ├── settings.gradle               #    Module structure + Expo autolinking
│   ├── gradle.properties             #    Build flags (Hermes, new arch, minify)
│   ├── gradlew / gradlew.bat        #    Gradle wrapper scripts
│   └── gradle/wrapper/               #    Gradle wrapper JAR + properties (Gradle 8.13)
│
├── app.json                          # ⚙️ Expo config (name, plugins, permissions, sounds)
├── eas.json                          # 🏗️ EAS Build profiles (preview APK, production AAB)
├── package.json                      # 📦 Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration (strict mode)
├── index.ts                          # Entry point (gesture handler + expo-router)
├── build_android.bat                 # Windows build script with local JDK/SDK paths
├── ARCHITECTURE.md                   # Existing architecture reference document
├── .gitignore                        # Git ignore rules
└── .easignore                        # Files excluded from EAS builds
```

## Key Relationships

| Directory | Depends On | Depended On By |
|-----------|-----------|----------------|
| `app/` (screens) | `components/`, `context/`, `utils/`, `constants/` | Nothing |
| `components/` | `constants/` | `app/` |
| `context/` | `utils/`, `constants/` | `app/`, `components/` |
| `utils/` | `constants/` (hydration only) | `context/` |
| `constants/` | Nothing | Everything |
| `android/` | Nothing (native layer) | `utils/widget.ts` via NativeModules |
