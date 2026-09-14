---
sidebar_position: 1
title: Installation
---

# Installation

This guide walks you through installing everything needed to develop Water Cow, assuming you have never built a React Native application before.

## Prerequisites Overview

| Tool | What It Is | Why We Need It |
|------|-----------|---------------|
| **Git** | Version control | Clone and manage the source code |
| **Node.js** | JavaScript runtime | Runs the React Native development tools and Metro bundler |
| **JDK 17** | Java Development Kit | Kotlin and Android build tools require the JVM |
| **Android Studio** | Android IDE | Provides the Android SDK, emulator, and build tools |
| **EAS CLI** | Expo cloud build tool | Builds production APKs/AABs in the cloud |

## Step 1: Install Git

Download from [git-scm.com](https://git-scm.com/) and install with default settings.

Verify:
```bash
git --version
# Expected: git version 2.x.x
```

## Step 2: Install Node.js

Water Cow uses Expo SDK 57, which requires **Node.js 20 or later**.

Download the LTS version from [nodejs.org](https://nodejs.org/).

Verify:
```bash
node -v
# Expected: v20.x.x or later

npm -v
# Expected: 10.x.x or later
```

:::tip What is npm?
**npm** (Node Package Manager) downloads and manages JavaScript libraries. It's similar to Maven or Gradle for Java projects. The `package.json` file lists all dependencies, like a `pom.xml`.
:::

## Step 3: Install JDK 17

The Android build system (Gradle) runs on the JVM. This project requires **JDK 17**.

:::info Local JDK
This project includes a local `jdk-17/` directory (gitignored) and a `build_android.bat` script that sets `JAVA_HOME` automatically. You can use this if you don't want a system-wide JDK installation on Windows.
:::

### Option A: Use the bundled JDK (Windows only)

The project expects JDK at `d:\Projects\WaterCow\jdk-17\jdk-17.0.12+7`. If you have it there, the `build_android.bat` script works automatically.

### Option B: Install system-wide

Download [Eclipse Adoptium JDK 17](https://adoptium.net/) (formerly AdoptOpenJDK).

Set environment variables on Windows:

1. Open **System Properties** → **Advanced** → **Environment Variables**
2. Add a new **System variable**:
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot` (your actual path)
3. Edit `Path` → Add `%JAVA_HOME%\bin`

Verify:
```bash
java -version
# Expected: openjdk version "17.0.x" ...
```

## Step 4: Install Android Studio

Download from [developer.android.com/studio](https://developer.android.com/studio).

During installation, ensure these components are selected:
- **Android SDK**
- **Android SDK Platform-Tools**
- **Android SDK Build-Tools**

After installation, open Android Studio → **SDK Manager** and verify:

| Component | Required Version |
|-----------|-----------------|
| Android SDK Platform | API 35 (or the version matching the project's `compileSdk`) |
| Android SDK Build-Tools | Latest |
| Android SDK Platform-Tools | Latest |
| Android Emulator | Optional (for testing without a physical device) |

### Set ANDROID_HOME

Add environment variable:
- Variable name: `ANDROID_HOME`
- Variable value: `C:\Users\<your-username>\AppData\Local\Android\Sdk`

Add to `Path`:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

Verify:
```bash
adb --version
# Expected: Android Debug Bridge version 1.0.x
```

## Step 5: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd WaterCow

# Install JavaScript dependencies
npm install
```

This reads `package.json` and downloads all dependencies into the `node_modules/` directory.

## Step 6: Install EAS CLI (Optional)

EAS (Expo Application Services) is used for cloud builds. Install it globally:

```bash
npm install -g eas-cli
eas login
```

Verify:
```bash
eas --version
# Expected: eas-cli/x.x.x
```

## Verification Checklist

Run these commands to confirm everything is installed:

```bash
node -v          # Should be 20+
npm -v           # Should be 10+
java -version    # Should be 17
adb --version    # Should show version info
git --version    # Should show version info
```

## Next Steps

- [Development Environment](/docs/getting-started/development-environment) — Configure your editor and environment variables
- [Running the App](/docs/getting-started/running) — Start the development server and run on your device
