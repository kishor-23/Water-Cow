---
sidebar_position: 2
title: Development Environment
---

# Development Environment

This page explains the tools and environment variables you need configured to develop Water Cow.

## Required Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `JAVA_HOME` | Path to JDK 17 | Gradle uses this to find the Java compiler |
| `ANDROID_HOME` | Path to Android SDK | React Native uses this to find Android build tools |

### Windows Configuration

Open **System Properties** → **Advanced** → **Environment Variables** and add:

```
JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.12+7-hotspot
ANDROID_HOME = C:\Users\<username>\AppData\Local\Android\Sdk
```

Add to `Path`:
```
%JAVA_HOME%\bin
%ANDROID_HOME%\platform-tools
```

:::info Project-local JDK
The `build_android.bat` script in the project root sets `JAVA_HOME` to a local `jdk-17/` directory. If you use that script, you don't need a system-wide `JAVA_HOME`.
:::

## Node.js Version

The project requires **Node.js 20+** (see the Docusaurus `engines` field and Expo SDK 57 requirements). If you use multiple Node versions, consider using [nvm-windows](https://github.com/coreybutler/nvm-windows) to switch between versions.

```bash
node -v   # Must be 20+
npm -v    # Comes with Node
```

## Key CLI Tools

| Command | What It Does |
|---------|-------------|
| `npx expo` | The Expo CLI — start dev server, run on device, prebuild native code |
| `npx expo start` | Start the Metro bundler (JavaScript dev server) |
| `npx expo run:android` | Build and install the app on an Android device/emulator |
| `npx expo prebuild` | Generate the native `android/` directory from Expo config |
| `eas` | Expo Application Services CLI — cloud builds |

You do **not** need to install Expo CLI globally. The `npx` prefix runs it directly from the project's `node_modules`.

## Editor Setup

### VS Code (Recommended)

Useful extensions:
- **TypeScript** — Built-in, provides type checking
- **React Native Tools** — Debugging support
- **ES7+ React/Redux/React-Native Snippets** — Code snippets
- **Kotlin** — Syntax highlighting for native Android code

### Android Studio

Use Android Studio for:
- **Editing Kotlin files** — Better code completion than VS Code
- **Android Logcat** — View device logs
- **Layout Inspector** — Debug Android widget XML layouts
- **SDK Manager** — Install/update Android SDK components

## Connecting a Physical Device

1. Enable **Developer Options** on your phone (Settings → About → tap Build Number 7 times)
2. Enable **USB Debugging** in Developer Options
3. Connect via USB cable
4. Verify connection:

```bash
adb devices
# Should list your device
```

## Using an Emulator

1. Open Android Studio → **Device Manager**
2. Create a new virtual device (Pixel 7 or similar)
3. Select a system image (API 34 or 35)
4. Start the emulator
5. Run:

```bash
npx expo run:android
# Will automatically target the running emulator
```

:::warning Emulator and Architectures
The project's `gradle.properties` targets `armeabi-v7a,arm64-v8a` architectures. Android emulators use `x86_64`. If the app fails to install on an emulator, temporarily add `x86_64` to `reactNativeArchitectures` in `android/gradle.properties`.
:::
