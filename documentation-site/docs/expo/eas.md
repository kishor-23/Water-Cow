---
sidebar_position: 4
title: EAS (Expo Application Services)
---

# EAS Build & Submit

**EAS (Expo Application Services)** is Expo's cloud service for building and submitting app binaries (APK, AAB, IPA).

## `eas.json` Configuration

If configured for cloud builds, `eas.json` defines build profiles for previewing and production:

```json
{
  "cli": {
    "version": ">= 10.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
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

## Useful EAS Commands

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure EAS Build for the project
eas build:configure

# Build a standalone Android APK for testing on physical devices
eas build -p android --profile preview

# Build an Android App Bundle (AAB) for Google Play release
eas build -p android --profile production
```

## Building APK Locally (Alternative to EAS Cloud)

You can also build standalone Android APKs locally using Gradle without an EAS account:

```bash
cd android
./gradlew assembleRelease
```
The output APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`
