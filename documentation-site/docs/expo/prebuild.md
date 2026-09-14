---
sidebar_position: 3
title: Prebuild System
---

# Expo Prebuild (`npx expo prebuild`)

**Prebuild** is the process where Expo takes your `app.json` configuration, assets, and config plugins, and generates/updates the native `android/` directory.

## Continuous Native Generation (CNG) vs Custom Native Code

In standard Expo projects, the `android/` directory is treated as a build artifact that can be deleted and regenerated at any time using `npx expo prebuild --clean`.

However, in Water Cow:
- We have added custom Kotlin native code in `android/app/src/main/java/com/watercow/app/`.
- We have custom XML layout resources in `android/app/src/main/res/layout/`.
- We have widget metadata in `android/app/src/main/res/xml/`.

> [!WARNING]
> Running `npx expo prebuild --clean` will **delete** native customizations unless they are encapsulated in Expo Config Plugins or kept in the git repository. Ensure all custom native files are tracked in git!

## Config Plugins in `app.json`

The `app.json` file configures native build properties:

```json
{
  "expo": {
    "name": "Water Cow",
    "slug": "water-cow",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.watercow.app"
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "sounds": [
            "./assets/sounds/moo1.mp3",
            "./assets/sounds/moo2.mp3",
            "./assets/sounds/bubble.mp3",
            "./assets/sounds/splash.mp3",
            "./assets/sounds/chime.mp3"
          ]
        }
      ]
    ]
  }
}
```
