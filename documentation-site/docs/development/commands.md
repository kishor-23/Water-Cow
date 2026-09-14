---
sidebar_position: 5
title: Command Reference
---

# Command Reference

All NPM and CLI scripts available in the Water Cow repository.

## Development Commands

```bash
# Start Metro bundler with dev menu
npx expo start

# Start Metro bundler with clean cache
npx expo start -c

# Build native Android binaries and launch on emulator/device
npx expo run:android

# Generate / update native android/ folder from app.json
npx expo prebuild
```

## Type Checking & Quality Control

```bash
# Check TypeScript errors across the app without compiling
npx tsc --noEmit

# Run ESLint linting rules
npm run lint
```

## Android Gradle Native Commands

```bash
# Clean Android build artifacts
cd android && ./gradlew clean

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease

# Build release Android App Bundle (AAB)
cd android && ./gradlew bundleRelease
```

## Documentation Commands

```bash
# Start local documentation dev server (port 3000)
cd documentation-site && npm start

# Build production documentation site
cd documentation-site && npm run build

# Generate TypeDoc API documentation from TypeScript source
npm run docs:typedoc
```
