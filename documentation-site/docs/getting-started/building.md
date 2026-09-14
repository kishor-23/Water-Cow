---
sidebar_position: 4
title: Building
---

# Building the App

Water Cow can be built as a **debug APK** (for development), a **preview APK** (for testing), or a **production AAB** (for Google Play Store).

## Build Types Explained

| Build | Output | Size | Use Case |
|-------|--------|------|----------|
| Debug | `.apk` | ~80–120MB | Development — includes dev tools, source maps, all architectures |
| Preview (EAS) | `.apk` | ~25–30MB | Testing — optimized, installable directly on a phone |
| Production (EAS) | `.aab` | ~15–20MB | Google Play Store — Android App Bundle format |

### APK vs AAB

- **APK** (Android Package) — A single installable file. You can send it to anyone and they can install it directly. Good for testing.
- **AAB** (Android App Bundle) — Google Play's format. Google generates optimized APKs for each device architecture and screen density. Smaller downloads for users but **cannot be installed directly** — must go through the Play Store.

## Option 1: Local Debug Build

```bash
npx expo run:android
```

This builds a debug APK and installs it on your connected device. The APK is at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Option 2: Local Release Build

```bash
npx expo run:android --variant release
```

Or using Gradle directly:
```bash
cd android
.\gradlew.bat assembleRelease
```

The release APK is at:
```
android/app/build/outputs/apk/release/app-release.apk
```

:::warning Release signing
The project currently uses the debug keystore for release builds (see `android/app/build.gradle` line 110). For production distribution, generate a proper signing key. See the [React Native signing guide](https://reactnative.dev/docs/signed-apk-android).
:::

## Option 3: EAS Preview Build (Recommended for Testing)

EAS builds the app in the cloud. No local Android SDK or JDK needed.

```bash
# Login to Expo (one-time)
eas login

# Build a preview APK
eas build --profile preview --platform android
```

The `preview` profile in `eas.json` is configured to output an APK:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

After the build completes (5–15 minutes), download the APK from the link in your terminal or from [expo.dev](https://expo.dev).

## Option 4: EAS Production Build

```bash
eas build --profile production --platform android
```

The `production` profile uses default settings, which outputs an AAB for Google Play Store.

## Using the build_android.bat Script

The project includes a convenience script at `build_android.bat` that:
1. Sets `JAVA_HOME` to the local JDK
2. Sets `ANDROID_HOME` to local platform-tools
3. Runs `gradlew.bat assembleDebug`

```bash
.\build_android.bat
```

This is useful if you don't have system-wide JDK/SDK configured.

## Clean Build

If a build fails with stale cache errors:

```bash
# Clean Gradle build cache
cd android
.\gradlew.bat clean
cd ..

# Clean Metro cache and rebuild
npx expo start --clear
npx expo run:android
```

Or use the npm clean script:
```bash
npm run clean
```

This script removes `android/app/build/` and `android/.cxx/` directories.
