---
sidebar_position: 2
title: Android SDK
---

# Android SDK

The Android SDK provides the tools and libraries needed to compile and run the app on Android devices.

## SDK Versions in This Project

Configured in `android/app/build.gradle`:

| Setting | Value | Meaning |
|---------|-------|---------|
| `compileSdk` | 35 | The API level used to compile the app. You need this SDK platform installed. |
| `targetSdk` | 35 | The API level the app is designed for. Determines which runtime behaviors apply. |
| `minSdk` | 24 | The lowest Android version the app supports (Android 7.0 Nougat). |

### What These Mean

- **compileSdk**: "I want to use APIs up to Android 15 (API 35)." You need Android SDK Platform 35 installed in Android Studio.
- **targetSdk**: "My app has been tested against Android 15 behaviors." Android applies backward-compatibility for older apps.
- **minSdk**: "My app won't install on devices below Android 7.0." This is set by Expo SDK 57's requirements.

## Checking Installed SDKs

Open Android Studio → **Settings** → **SDK Manager** → **SDK Platforms**.

Ensure **Android API 35** is checked and installed.

Also check **SDK Tools** tab:
- Android SDK Build-Tools (latest)
- Android SDK Platform-Tools (latest)
- Android Emulator (if using emulators)

## ANDROID_HOME

The `ANDROID_HOME` environment variable tells the build system where the SDK is installed:

- **Windows default**: `C:\Users\<username>\AppData\Local\Android\Sdk`
- **macOS default**: `~/Library/Android/sdk`
- **Linux default**: `~/Android/Sdk`

The `build_android.bat` script sets `ANDROID_HOME` to a local path for Windows.
