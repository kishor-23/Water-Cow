---
sidebar_position: 1
title: Water Tracking
---

# Water Tracking

The core feature of Water Cow — logging, calculating, and displaying daily water intake.

## How It Works

1. User taps a quick-add button (e.g., "+250 ml") or enters a custom amount
2. A `WaterEntry` object is created with a unique ID, the amount, and a timestamp
3. The entry is dispatched to the reducer, which updates the state
4. Side effects persist to AsyncStorage and update the native widget
5. The UI re-renders showing the updated progress

## WaterEntry Structure

```typescript
interface WaterEntry {
  id: string;          // Unique identifier (UUID)
  amount: number;      // Amount in milliliters
  timestamp: number;   // Unix timestamp (ms)
}
```

## Quick Add vs Custom Amount

### Quick Add (Home Screen)

The home screen displays a "+250 ml" button. This is the most common action.

```typescript
// In HydrationContext
function addWater(amount: number) {
  dispatch({
    type: 'ADD_WATER',
    payload: {
      id: generateId(),
      amount,
      timestamp: Date.now(),
    },
  });
}
```

### Custom Amount (Add Screen)

The Add Water screen (`app/(tabs)/add.tsx`) provides:
- An animated glass water view showing the amount
- Preset buttons (100ml, 250ml, 500ml, etc.)
- Custom input for arbitrary amounts
- Unit support (ml or oz, stored in UserProfile)

## Unit Conversion

The app stores everything internally in **milliliters**. When the user sets their unit to ounces:

```typescript
// Display: convert ml → oz
function formatAmount(ml: number, unit: 'ml' | 'oz'): string {
  if (unit === 'oz') return `${(ml / 29.5735).toFixed(1)} oz`;
  return `${ml} ml`;
}

// Input: convert oz → ml for storage
function toMl(amount: number, unit: 'ml' | 'oz'): number {
  if (unit === 'oz') return Math.round(amount * 29.5735);
  return amount;
}
```

## Daily Goal

The daily goal is stored in `UserProfile.dailyGoal` (default: 2000 ml). Progress is calculated as:

```typescript
const progress = Math.min(state.totalConsumed / state.profile.dailyGoal, 1);
```

Progress is clamped to 1.0 (100%) — the progress ring fills completely at goal, even if the user drinks more.

## Day Reset

Entries are stored with a date key (`watercow_entries_YYYY-MM-DD`). When the app opens on a new day:
1. The context detects the date has changed
2. Dispatches `RESET_DAY` to clear today's entries
3. The previous day's data is already saved in history

## History

The app maintains a rolling 90-day history:

```typescript
interface DayData {
  date: string;        // YYYY-MM-DD
  totalConsumed: number;
  dailyGoal: number;
  entries: WaterEntry[];
}
```

The history screen shows this data as bar charts (7-day and 30-day views) using the `BarChart` component.

## Widget Quick Add

Users can add water directly from the home screen widget without opening the app:
1. Widget stores `pending_quick_adds` count in SharedPreferences
2. When the app opens, it reads the count and applies the entries
3. The count is reset to zero

See [Widget Feature](/docs/features/widget) for details.
