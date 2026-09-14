---
sidebar_position: 4
title: Custom Hooks
---

# Custom Hooks

Water Cow exposes two custom hooks that abstract away the global state details.

## useHydration

**File**: `context/HydrationContext.tsx`

Access the hydration state and actions from any component.

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `state` | `HydrationState` | Current hydration state |
| `addWater` | `(amount: number) => void` | Add a water entry |
| `deleteEntry` | `(id: string, dateKey?: string) => void` | Delete an entry |
| `updateProfile` | `(profile: Partial<UserProfile>) => void` | Update user profile |
| `updateReminders` | `(settings: ReminderSettings) => void` | Update reminder settings |
| `setGoal` | `(goal: number) => void` | Set daily water goal |
| `resetDay` | `() => void` | Reset today's entries |
| `importData` | `(data: BackupData) => void` | Import backup data |
| `progress` | `number` | 0–1 progress ratio (consumed / goal) |
| `cowMood` | `CowMood` | Current cow mood string |

### Usage

```tsx
import { useHydration } from '../context/HydrationContext';

function HomeScreen() {
  const { state, addWater, progress, cowMood } = useHydration();

  return (
    <View>
      <ProgressRing
        progress={progress}
        consumed={formatAmount(state.totalConsumed, state.profile.unit)}
        goal={formatAmount(state.profile.dailyGoal, state.profile.unit)}
      />
      <CowAnimated mood={cowMood} />
      <TouchableOpacity onPress={() => addWater(250)}>
        <Text>+250 ml</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Error Handling

If `useHydration()` is called outside of `<HydrationProvider>`, it throws:

```
Error: useHydration must be used within a HydrationProvider
```

The provider is set up in `app/_layout.tsx`.

---

## useTheme

**File**: `constants/theme.ts`

Access the active theme colors and mode.

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `colors` | `ColorPalette` | Active color palette (light or dark) |
| `isDark` | `boolean` | Whether dark mode is active |
| `themeMode` | `ThemeMode` | `'system'` \| `'light'` \| `'dark'` |
| `setThemeMode` | `(mode: ThemeMode) => void` | Change the theme mode |

### Usage

```tsx
import { useTheme, Typography, Spacing } from '../constants/theme';

function MyComponent() {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.textPrimary }}>
        Current theme: {isDark ? 'Dark' : 'Light'}
      </Text>
    </View>
  );
}
```

### Theme vs Typography/Spacing

`useTheme()` returns **dynamic** values (colors that change with light/dark mode).

`Typography`, `Spacing`, `BorderRadius`, and `Shadows` are **static** constants that don't change with theme mode — import them directly:

```tsx
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
```
