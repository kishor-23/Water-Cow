---
sidebar_position: 1
title: How to Add Features
---

# How to Add New Features

This guide provides step-by-step instructions for adding common types of new features to Water Cow.

## Adding a New Quick-Add Drink Button

To add a new preset drink volume button (e.g., "+350 ml" or "+500 ml"):

1. Open `constants/hydration.ts`.
2. Add your new value to `QUICK_ADD_VOLUMES` or relevant constants.
3. If creating a new drink type (e.g., Tea, Coffee), update `DrinkType` interface and icon mappings in `components/hydration/DrinkSelector.tsx`.
4. Update `HydrationContext.tsx` if special factor multipliers (e.g., hydration coefficient for caffeine) are needed.

## Adding a New Screen

To add a new screen (e.g., an Achievements or Statistics screen):

1. Create a new file in `app/` (e.g., `app/achievements.tsx`).
2. Implement your component using standard React Native UI components (`View`, `Text`, `TouchableOpacity`).
3. Wrap your screen logic in `useHydration()` to access global state:
   ```tsx
   import React from 'react';
   import { View, Text } from 'react-native';
   import { useHydration } from '../context/HydrationContext';

   export default function AchievementsScreen() {
     const { state } = useHydration();
     return (
       <View>
         <Text>Total Intake: {state.todayIntake} ml</Text>
       </View>
     );
   }
   ```
4. Update navigation links in `app/(tabs)/index.tsx` or `app/(tabs)/settings.tsx` using `expo-router`'s `<Link>` or `useRouter()`.

## Adding a New Settings Option

1. Update `UserSettings` interface in `types/hydration.ts`:
   ```typescript
   export interface UserSettings {
     // ... existing settings
     newFeatureEnabled: boolean;
   }
   ```
2. Add default value in `DEFAULT_SETTINGS` in `constants/hydration.ts`.
3. Update settings UI component in `components/settings/SettingsSection.tsx` or `app/(tabs)/settings.tsx` with a toggle/picker.
4. Call `updateSettings({ newFeatureEnabled: value })` from `useHydration()`.
