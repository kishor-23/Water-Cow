---
sidebar_position: 1
title: Architecture Overview
---

# Architecture Overview

Water Cow follows a layered architecture where data flows from user interactions down through a context layer to storage and native APIs, and back up to the UI.

## High-Level Architecture

```mermaid
graph TD
    U[User] --> UI[React Native UI Layer]
    UI --> |Tabs| S1[Home Screen]
    UI --> |Tabs| S2[Add Water Screen]
    UI --> |Tabs| S3[History Screen]
    UI --> |Tabs| S4[Reminders Screen]
    UI --> |Tabs| S5[Settings Screen]

    S1 --> C[Components Layer]
    S2 --> C
    S3 --> C
    S4 --> C
    S5 --> C

    C --> CTX[Context Layer]
    CTX --> HC[HydrationContext]
    CTX --> TC[ThemeContext]

    HC --> UTILS[Utilities Layer]
    UTILS --> ST[storage.ts]
    UTILS --> NT[notifications.ts]
    UTILS --> HY[hydration.ts]
    UTILS --> WD[widget.ts]
    UTILS --> BK[backup.ts]

    ST --> AS[(AsyncStorage)]
    NT --> EN[expo-notifications]
    WD --> NM[Native Module Bridge]
    NM --> KT[Kotlin Widget Provider]
    KT --> SP[(SharedPreferences)]
    KT --> RV[RemoteViews Widget]
    EN --> AC[Android Notification Channels]
    AC --> SND[Custom Sounds]

    style U fill:#E8F4FD,stroke:#4A9FD8
    style CTX fill:#E8F5E9,stroke:#4CAF50
    style UTILS fill:#FFF3E0,stroke:#FF9800
    style AS fill:#F3E5F5,stroke:#9C27B0
    style SP fill:#F3E5F5,stroke:#9C27B0
```

## Layer Descriptions

### 1. UI Layer (`app/`)

The screens that the user sees and interacts with. Uses **expo-router** file-based routing with a tab navigator (bottom tab bar with 5 tabs).

### 2. Components Layer (`components/`)

Reusable UI building blocks used across screens. Split into:
- **`cow/`** — Cow mascot SVG rendering and animations
- **`ui/`** — General purpose components (cards, progress ring, charts, buttons)

### 3. Context Layer (`context/`)

Global state management using React's **Context + useReducer** pattern. Two providers wrap the entire app:
- **HydrationContext** — All water tracking state, actions, and derived values
- **ThemeContext** — Light/dark mode preference and active color scheme

### 4. Utilities Layer (`utils/`)

Pure business logic and platform integration functions. No UI code. Five modules:
- **storage.ts** — AsyncStorage read/write operations
- **notifications.ts** — Notification channel management and scheduling
- **hydration.ts** — Date formatting, progress calculation, time helpers
- **widget.ts** — Native Android widget bridge
- **backup.ts** — Export/import JSON backups

### 5. Constants (`constants/`)

Static configuration values and design tokens:
- **theme.ts** — Color palette, typography, spacing, shadows (light + dark)
- **cowMoods.ts** — Cow mood calculation algorithm and mood definitions

### 6. Native Layer (`android/`)

Kotlin code that handles features React Native cannot do directly:
- **Widget** — `AppWidgetProvider` + `RemoteViews` for the Android home screen widget
- **Notification Module** — Native module for creating notification channels with custom sounds
- **Native Module Bridge** — `ReactPackage` that registers the native modules with React Native

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Screen
    participant HydrationContext
    participant Storage
    participant Widget
    participant Notifications

    User->>Screen: Taps "+250 ml"
    Screen->>HydrationContext: addWater(250)
    HydrationContext->>HydrationContext: dispatch ADD_WATER
    HydrationContext->>HydrationContext: reducer updates state
    HydrationContext->>Storage: saveTodayEntries()
    HydrationContext->>Storage: saveDayData()
    HydrationContext->>Widget: updateNativeWidget()
    Widget->>Widget: SharedPreferences write
    Widget->>Widget: RemoteViews refresh
    HydrationContext-->>Screen: Re-render with new state
    Screen-->>User: Updated progress ring, stats
```

## Key Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Context + useReducer** | `HydrationContext.tsx` | Centralized state with predictable updates, like a mini-Redux |
| **Unidirectional data flow** | Everywhere | Actions → reducer → state → UI. No two-way binding. |
| **Side effects in useEffect** | `HydrationContext.tsx` | Persistence and widget updates happen as reactions to state changes |
| **Native Module bridge** | `widget.ts` ↔ `WaterCowWidgetModule.kt` | JS calls Kotlin via React Native's NativeModules |
| **SharedPreferences sync** | Widget system | React Native and native widget share data via Android SharedPreferences |
