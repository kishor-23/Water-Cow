---
sidebar_position: 1
title: Build Errors
---

# Troubleshooting Build Errors

Solutions for build and compilation errors commonly encountered in Android Gradle or Expo prebuild.

## 1. Gradle Sync Failed: Invalid Java Home / JDK Version

### Symptom
```text
Unsupported class file major version 65 (or 61)
Gradle requires Java 17 or higher to run.
```

### Solution
- Verify JDK 17 is installed: `java -version`
- Set `JAVA_HOME` environment variable to JDK 17 installation folder.
- In Android Studio: **Settings > Build, Execution, Deployment > Build Tools > Gradle > Gradle JDK** -> Select **JDK 17**.

## 2. Duplicate Class / Dependency Conflict

### Symptom
```text
Duplicate class com.google.common.util.concurrent.ListenableFuture found in modules...
```

### Solution
Add `resolutionStrategy` force rules in `android/app/build.gradle`:
```groovy
android {
    configurations.all {
        resolutionStrategy {
            force 'com.google.guava:listenablefuture:9999.0-empty-to-avoid-conflict-with-guava'
        }
    }
}
```
Run `cd android && ./gradlew clean`.

## 3. Metro Bundler Cache Corruption

### Symptom
```text
Unable to resolve module ...
```
or unexpected JSX syntax errors.

### Solution
Reset Metro bundler cache:
```bash
npx expo start -c
```
Or clear node modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```
