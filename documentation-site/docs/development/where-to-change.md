---
sidebar_position: 4
title: "Quick Reference: Where to Change What"
---

# Quick Reference: Where to Change What

Use this cheat sheet to quickly find which file to modify when tasked with a change.

| I want to change... | File to edit |
| :--- | :--- |
| **Daily goal calculation / constants** | `constants/hydration.ts` |
| **Quick-add drink volumes** | `constants/hydration.ts` |
| **Cow mascot SVG shapes / colors** | `components/cow/CowMascot.tsx` |
| **Cow mood thresholds / text messages** | `constants/cowMoods.ts` |
| **Global hydration state logic** | `context/HydrationContext.tsx` |
| **Local storage save / load logic** | `utils/storage.ts` |
| **Notification scheduling & intervals** | `services/notificationService.ts` |
| **Notification sound channels (Native)** | `android/app/src/main/java/com/watercow/app/WaterCowNotificationModule.kt` |
| **Android home screen widget layout** | `android/app/src/main/res/layout/water_cow_widget.xml` |
| **Android home screen widget logic** | `android/app/src/main/java/com/watercow/app/WaterCowWidgetProvider.kt` |
| **App color palette / theme colors** | `constants/theme.ts` |
| **Navigation tabs / bar icons** | `app/(tabs)/_layout.tsx` |
| **Settings UI / Toggles** | `app/(tabs)/settings.tsx` |
| **History calendar / charts** | `app/(tabs)/history.tsx` |
| **JSON Backup / Restore service** | `services/backupService.ts` |
