---
sidebar_position: 4
title: Common Errors Cheat Sheet
---

# Common Errors Cheat Sheet

Quick lookup table for error messages and resolution steps.

| Error Message | Likely Cause | Solution |
| :--- | :--- | :--- |
| `Native module WaterCowWidgetModule is null` | App running in Expo Go instead of Dev Build | Build & run using `npx expo run:android` |
| `TypeError: Cannot read property 'todayIntake' of null` | Component rendered outside `<HydrationProvider>` | Wrap screen/component with `<HydrationProvider>` in `_layout.tsx` |
| `EACCES: permission denied` | Terminal permissions or locked file | Close emulator/IDE instances or run terminal as Administrator |
| `Invalid JSON import` | Backup JSON corrupted or incorrect format | Check schema in `services/backupService.ts` |
| `Network error` | Metro bundler unable to reach device | Run `adb reverse tcp:8081 tcp:8081` |
