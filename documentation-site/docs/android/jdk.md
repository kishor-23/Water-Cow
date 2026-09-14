---
sidebar_position: 3
title: JDK
---

# JDK (Java Development Kit)

The Android build system (Gradle) is a JVM application. It requires a Java Development Kit to run. This project requires **JDK 17**.

## Why JDK 17?

Android Gradle Plugin (AGP) and React Native 0.86 require JDK 17:
- AGP 8.x requires JDK 17+
- Kotlin compiler targets JVM 17
- Gradle 8.13 supports JDK 17–21

:::warning JDK 21 May Not Work
While Gradle 8.13 supports JDK 21, some Expo/RN plugins may not be compatible yet. Stick with JDK 17.
:::

## JRE vs JDK

| Tool | What It Is | Enough for Water Cow? |
|------|-----------|----------------------|
| **JRE** (Java Runtime Environment) | Runs Java programs | ❌ No — cannot compile |
| **JDK** (Java Development Kit) | JRE + compiler + tools | ✅ Yes — required for building |

If you get "Could not find tools.jar" errors, you installed a JRE instead of a JDK.

## Setting JAVA_HOME

### Windows

```
JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.12+7-hotspot
```

Add `%JAVA_HOME%\bin` to your `Path`.

### Using the Bundled JDK

The project includes a `build_android.bat` script that uses a local JDK:

```batch
set JAVA_HOME=d:\Projects\WaterCow\jdk-17\jdk-17.0.12+7
```

This directory is gitignored. Download [Eclipse Adoptium JDK 17](https://adoptium.net/) and extract it to `jdk-17/` in the project root.

## Verifying

```bash
java -version
# Expected: openjdk version "17.0.x" ...

javac -version
# Expected: javac 17.0.x
```
