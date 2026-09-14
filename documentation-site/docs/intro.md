---
slug: /intro
sidebar_position: 1
title: Welcome to Water Cow Docs
---

# 🐄 Water Cow Developer Documentation

Welcome to the Water Cow developer documentation. This guide helps you understand, develop, debug, and extend the Water Cow hydration reminder app.

## What is Water Cow?

Water Cow is a **daily water intake tracker** for Android. It features a charming animated cow mascot whose mood changes based on your hydration level — no badges, XP, or gamification, just a friendly companion encouraging you to stay hydrated.

## Main Features

| Feature | Description |
|---------|-------------|
| 🐄 **Cow Mascot** | Animated SVG cow with 5 mood states (happy, reminder, tired, dehydrated, goal complete) |
| 💧 **Water Tracking** | Log intake with quick-add buttons (250ml) or custom amounts |
| 📊 **Progress Dashboard** | Animated progress ring, stats cards, and daily summary |
| ⏰ **Smart Reminders** | Configurable interval reminders with custom cow sounds |
| 🔔 **Custom Sounds** | Cow moo and cow bell notification sounds via Android notification channels |
| 📱 **Home Screen Widget** | Native Android widget showing live water stats |
| 📅 **History** | 7-day and 30-day bar charts with daily breakdowns |
| 🌙 **Theming** | Light, dark, and system-follow theme modes |
| 💾 **Backup/Restore** | Export and import data as JSON files |

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.86.3 | Cross-platform mobile UI framework |
| Expo SDK | 57 | Managed workflow, modules, build tools |
| TypeScript | 6.0.3 | Type-safe JavaScript |
| Kotlin | (via AGP) | Native Android code (widget, notification module) |
| AsyncStorage | 2.2.0 | Local key-value persistence |
| expo-notifications | ~57.0.18 | Scheduled local notifications |
| expo-router | ~57.0.21 | File-based navigation |
| react-native-reanimated | 4.5.1 | 60fps animations |
| react-native-svg | 15.15.4 | SVG rendering for cow mascot |

## Quick Navigation

### I'm new here
- [Installation Guide](/docs/getting-started/installation) — Set up your development environment from scratch
- [React Native Concepts](/docs/react-native/concepts) — Understand the basics if you're new to React Native

### I need to understand the codebase
- [Architecture Overview](/docs/architecture/overview) — High-level system design with diagrams
- [Folder Structure](/docs/architecture/folder-structure) — What every file and directory does
- [Architecture Decisions](/docs/architecture/decisions) — Why each technology was chosen

### I need to add or change something
- [Adding Features](/docs/development/adding-features) — Step-by-step guide to building new features
- [Where Do I Change This?](/docs/development/where-to-change) — Quick reference for finding the right file
- [Command Cheatsheet](/docs/development/commands) — All the commands you need

### Something is broken
- [Debugging Guide](/docs/development/debugging) — How to identify and fix common problems
- [Build Errors](/docs/troubleshooting/build-errors) — Gradle, SDK, and JDK issues
- [Notification Errors](/docs/troubleshooting/notification-errors) — Sound not playing, channel issues
- [Widget Errors](/docs/troubleshooting/widget-errors) — Widget not appearing

### Reference Documentation
- [Components Reference](/docs/react-native/components) — Component props and usage
- [Custom Hooks](/docs/react-native/custom-hooks) — `useHydration` hook API

## This Application Does Not Use a Backend API

Water Cow is a fully offline, local-only application. All data (water entries, settings, history) is stored on-device using AsyncStorage. There are no HTTP endpoints, no server, no authentication, and no cloud sync.
