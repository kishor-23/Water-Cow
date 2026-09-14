---
sidebar_position: 7
title: Theming
---

# Theming

Water Cow supports three theme modes: **light**, **dark**, and **system** (follows the device setting).

## Theme Modes

| Mode | Behavior |
|------|----------|
| `light` | Always uses the light color palette |
| `dark` | Always uses the dark color palette |
| `system` | Follows the device's system-wide dark mode setting |

The active mode is stored in AsyncStorage under the key `watercow_theme_mode`.

## Color Palettes

Defined in `constants/theme.ts`:

### Light Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#38BDF8` (sky blue) | Primary actions, progress indicators |
| `background` | `#F0F9FF` (very light blue) | Screen backgrounds |
| `surface` | `#FFFFFF` | Cards, containers |
| `surfaceBlue` | `#E0F2FE` | Subtle blue backgrounds |
| `textPrimary` | `#0C4A6E` | Main text |
| `textSecondary` | `#0369A1` | Secondary text |
| `textTertiary` | `#7DD3FC` | Subtle labels |
| `border` | `rgba(56, 189, 248, 0.15)` | Card borders |
| `tabBarBg` | `rgba(240, 249, 255, 0.92)` | Tab bar background |

### Dark Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#38BDF8` | Same blue for brand consistency |
| `background` | `#0A1628` | Deep dark background |
| `surface` | `#162236` | Dark cards |
| `surfaceBlue` | `#1E3A5F` | Dark blue backgrounds |
| `textPrimary` | `#F0F9FF` | Light text on dark |
| `textSecondary` | `#BAE6FD` | Secondary light text |
| `textTertiary` | `#0C4A6E` | Subtle labels (dark) |
| `border` | `rgba(56, 189, 248, 0.12)` | Subtle borders |
| `tabBarBg` | `rgba(10, 22, 40, 0.95)` | Dark tab bar |

## Typography

The app uses the [Inter](https://fonts.google.com/specimen/Inter) font family with 5 weights:

| Weight | Constant | Usage |
|--------|----------|-------|
| 400 | `Typography.fontFamily.regular` | Body text, labels |
| 500 | `Typography.fontFamily.medium` | Buttons, tab labels |
| 600 | `Typography.fontFamily.semiBold` | Stats values, subheadings |
| 700 | `Typography.fontFamily.bold` | Progress ring values, headings |
| 800 | `Typography.fontFamily.extraBold` | Screen titles |

Font sizes follow a standard scale:

| Token | Size |
|-------|------|
| `xs` | 12 |
| `sm` | 14 |
| `md` | 16 |
| `lg` | 18 |
| `xl` | 20 |
| `xxl` | 28 |

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4 | Tight spacing |
| `sm` | 8 | Small gaps |
| `md` | 12 | Standard gaps |
| `lg` | 16 | Section spacing |
| `xl` | 24 | Large gaps |
| `xxl` | 32 | Major sections |
| `xxxl` | 48 | Screen-level padding |

## Using the Theme in Components

```typescript
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

function MyComponent() {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{
        color: colors.textPrimary,
        fontFamily: Typography.fontFamily.medium,
        fontSize: Typography.size.md,
      }}>
        Hello
      </Text>
    </View>
  );
}
```

## Progress Color

The progress ring color changes based on the hydration percentage:

```typescript
function getProgressColor(progress: number): string {
  if (progress >= 1) return '#22C55E';    // Green — goal complete
  if (progress >= 0.75) return '#38BDF8'; // Blue — almost there
  if (progress >= 0.5) return '#38BDF8';  // Blue — halfway
  if (progress >= 0.25) return '#FBBF24'; // Yellow — getting started
  return '#EF4444';                       // Red — very low
}
```

## ThemeContext Implementation

`context/ThemeContext.tsx` provides:
- `themeMode` — Current mode (`'system'`, `'light'`, `'dark'`)
- `setThemeMode(mode)` — Updates mode and persists to AsyncStorage
- `isDark` — Boolean for current effective theme
- `colors` — Active color palette object

The system preference is read using React Native's `useColorScheme()` hook.
