---
sidebar_position: 4
title: Gradle
---

# Gradle Build System

Gradle is the build system for the Android portion of Water Cow. It compiles Kotlin code, processes resources, and packages everything into an APK or AAB.

## Gradle Files in This Project

| File | Purpose |
|------|---------|
| `android/build.gradle` | Project-level config (repositories, build tool versions) |
| `android/app/build.gradle` | App-level config (SDK versions, dependencies, custom tasks) |
| `android/settings.gradle` | Declares project modules and Expo autolinking |
| `android/gradle.properties` | Build flags and JVM settings |
| `android/gradlew.bat` | Gradle wrapper script (Windows) |
| `android/gradle/wrapper/gradle-wrapper.properties` | Specifies Gradle version (8.13) |

## Key Build Configuration (`android/app/build.gradle`)

### SDK Versions

```groovy
android {
    compileSdk rootProject.ext.compileSdkVersion  // 35
    defaultConfig {
        minSdkVersion rootProject.ext.minSdkVersion    // 24
        targetSdkVersion rootProject.ext.targetSdkVersion  // 35
    }
}
```

### Custom Sound Copy Task

A custom Gradle task copies notification sounds from `assets/sounds/` to `res/raw/`:

```groovy
task copyCustomSounds(type: Copy) {
    from '../../assets/sounds/'
    into 'src/main/res/raw/'
    include '*.mp3'
}
preBuild.dependsOn copyCustomSounds
```

This ensures the sounds are available as native Android resources for notification channels.

### Hermes Engine

```groovy
react {
    hermesEnabled = true  // Pre-compiles JS to bytecode for faster startup
}
```

### Widget Dependencies

```groovy
dependencies {
    implementation "androidx.glance:glance-appwidget:1.1.1"
    implementation "androidx.glance:glance-material3:1.1.1"
}
```

:::info Glance vs RemoteViews
The project includes Glance dependencies, but the widget is implemented using the traditional `AppWidgetProvider` + `RemoteViews` approach. Glance provides a Compose-based widget API but isn't used for rendering in the current implementation.
:::

## Gradle Properties (`gradle.properties`)

| Property | Value | Purpose |
|----------|-------|---------|
| `org.gradle.jvmargs` | `-Xmx2048m` | JVM heap size for Gradle daemon |
| `android.useAndroidX` | `true` | Use AndroidX libraries |
| `hermesEnabled` | `true` | Enable Hermes JS engine |
| `newArchEnabled` | `true` | Enable React Native New Architecture |
| `reactNativeArchitectures` | `armeabi-v7a,arm64-v8a` | Target ARM architectures only |
| `EX_DEV_CLIENT_NETWORK_INSPECTOR` | `true` | Enable network inspector for dev builds |

## Running Gradle Commands

```bash
# Build debug APK
cd android
.\gradlew.bat assembleDebug

# Build release APK
.\gradlew.bat assembleRelease

# Clean build cache
.\gradlew.bat clean

# List available tasks
.\gradlew.bat tasks

# Show dependencies
.\gradlew.bat :app:dependencies
```

## Build Pipeline

```mermaid
graph LR
    TS[TypeScript Source] -->|Metro Bundler| JS[JavaScript Bundle]
    JS -->|Hermes Compiler| BC[Hermes Bytecode]
    KT[Kotlin Source] -->|Kotlin Compiler| CL[.class files]
    CL -->|D8/R8| DEX[DEX bytecode]
    RES[XML Resources] -->|AAPT2| ARES[Compiled Resources]
    SND[Sound Files] -->|copyCustomSounds| RAW[res/raw/ resources]
    BC --> APK
    DEX --> APK
    ARES --> APK
    RAW --> APK
    APK[APK / AAB]

    style APK fill:#E8F5E9,stroke:#4CAF50
```
