---
sidebar_position: 2
title: Components
---

# Components Reference

All reusable components in the Water Cow project. Every component lives in `components/`.

## Cow Components (`components/cow/`)

### CowMascot

**File**: `components/cow/CowMascot.tsx`

Static SVG rendering of the cow character. Renders different expressions based on mood.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mood` | `CowMood` | required | `'happy'` \| `'goalComplete'` \| `'reminder'` \| `'tired'` \| `'dehydrated'` |
| `size` | `number` | `160` | Width and height in points |

```tsx
<CowMascot mood="happy" size={120} />
```

### CowAnimated

**File**: `components/cow/CowAnimated.tsx`

Animated wrapper around `CowMascot`. Adds idle bobbing and mood transition animations.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mood` | `CowMood` | required | Current cow mood |
| `size` | `number` | `160` | Size passed to CowMascot |
| `showMessage` | `boolean` | `true` | Whether to show the mood message below the cow |

```tsx
<CowAnimated mood={cowMood} size={160} showMessage />
```

### CowReminderAnimated

**File**: `components/cow/CowReminderAnimated.tsx`

Similar to CowAnimated but with different animation parameters, used on the reminders screen.

---

## UI Components (`components/ui/`)

### ProgressRing

**File**: `components/ui/ProgressRing.tsx`

Animated SVG circular progress indicator with center text.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | required | 0 to 1 progress ratio |
| `size` | `number` | `200` | Diameter in points |
| `strokeWidth` | `number` | `12` | Ring thickness |
| `consumed` | `string` | required | Center text top line (e.g., "1.5 L") |
| `goal` | `string` | required | Center text bottom line (e.g., "2.0 L") |

Features:
- Animated progress fill using `react-native-reanimated`
- Gradient stroke color
- Color changes based on progress (red → yellow → blue → green)

### Card

**File**: `components/ui/Card.tsx`

Frosted glass card with rounded corners and shadow. Three variants.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content inside the card |
| `style` | `ViewStyle` | — | Additional styles |
| `variant` | `'default'` \| `'frosted'` \| `'blue'` | `'default'` | Visual style |

```tsx
<Card variant="frosted">
  <Text>Card content</Text>
</Card>
```

### StatsCard

**File**: `components/ui/StatsCard.tsx`

Displays a stat with an icon, value, and label. Used on the home screen for daily stats.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `FeatherIconName` | required | Feather icon name |
| `value` | `string` | required | The stat value (e.g., "5") |
| `label` | `string` | required | Description (e.g., "Glasses") |
| `color` | `string` | theme primary | Accent color for icon |

### PillButton

**File**: `components/ui/PillButton.tsx`

Pill-shaped toggle button used for selecting options.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Button text |
| `selected` | `boolean` | `false` | Whether the button is active |
| `onPress` | `() => void` | required | Tap handler |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Button size |

### SegmentedControl

**File**: `components/ui/SegmentedControl.tsx`

Animated tab-like control with a sliding indicator. Used for 7-day/30-day toggle in history.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `string[]` | required | Option labels |
| `selected` | `number` | required | Active index |
| `onChange` | `(index) => void` | required | Selection change handler |

### BarChart

**File**: `components/ui/BarChart.tsx`

SVG bar chart showing daily water intake history. Used on the history screen.

### GlassWaterView

**File**: `components/ui/GlassWaterView.tsx`

Animated glass of water visualization used on the Add Water screen.

### HomeScreenWidgetModal

**File**: `components/ui/HomeScreenWidgetModal.tsx`

Modal dialog with instructions for adding the home screen widget.

### WallpaperWidgetModal

**File**: `components/ui/WallpaperWidgetModal.tsx`

Modal for exporting a wallpaper-style widget image.

### CustomLaunchScreen

**File**: `components/ui/CustomLaunchScreen.tsx`

Animated app launch screen shown after the native splash screen.
