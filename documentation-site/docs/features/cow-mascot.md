---
sidebar_position: 6
title: Cow Mascot
---

# Cow Mascot

The cow mascot is Water Cow's signature feature — an SVG cow character whose expression and mood change based on your hydration level.

## Mood System

The cow has **5 moods**, defined in `constants/cowMoods.ts`:

| Mood | Trigger | Expression | Glass Water Level |
|------|---------|-----------|------------------|
| `happy` | Progress ≥ 50% and drank recently | Squinting smile, pink cheeks | 14px (medium-high) |
| `goalComplete` | Progress ≥ 100% | Sparkle eyes, big smile | 18px (full) |
| `reminder` | Default/moderate state | Normal open eyes, slight smile | 12px (medium) |
| `tired` | Long time since last drink | Half-closed droopy eyes | 6px (low) |
| `dehydrated` | Very low progress, long gap | Sad droopy eyes, tear drop | 2px (nearly empty) |

## Mood Calculation

The `calculateCowMood()` function in `constants/cowMoods.ts` determines the mood based on two factors:

1. **Progress** — How much water has been consumed vs the daily goal
2. **Minutes since last drink** — How long ago the user last logged water

```typescript
function calculateCowMood(
  totalConsumed: number,
  dailyGoal: number,
  minutesSinceLastDrink: number,
  intervalMinutes: number,
): CowMood {
  const progress = totalConsumed / dailyGoal;

  if (progress >= 1) return 'goalComplete';
  if (minutesSinceLastDrink > intervalMinutes * 2) return 'dehydrated';
  if (minutesSinceLastDrink > intervalMinutes) return 'tired';
  if (progress >= 0.5) return 'happy';
  return 'reminder';
}
```

## SVG Rendering (`CowMascot.tsx`)

The cow is rendered entirely as an SVG using `react-native-svg`. No images or external assets — just code.

### Structure

| Part | SVG Elements | Dynamic? |
|------|-------------|----------|
| Body | 2 Ellipses (body + spots) | No |
| Head | 1 Ellipse + 1 spot Ellipse | No |
| Ears | 4 Ellipses (outer + inner pink) | No |
| Horns | 2 Paths (curved strokes) | No |
| Snout | 1 Ellipse + 2 nostril Ellipses | No |
| Cheeks | 2 pink Ellipses | Yes — only for happy/goalComplete |
| Eyes | Circles, Paths, Ellipses | **Yes — mood-dependent** |
| Mouth | Path (curve) | **Yes — mood-dependent** |
| Bell | Line + 2 Circles | No |
| Glass | Path + Rect + Line | **Yes — water level varies by mood** |

### Mood-Dependent Rendering

Three helper functions control the dynamic parts:

```typescript
function renderEyes(mood: CowMood)   // Returns different SVG elements per mood
function renderMouth(mood: CowMood)  // Different curve paths per mood
function renderGlass(mood: CowMood)  // Water level and color vary
```

## Animation (`CowAnimated.tsx`)

The animated wrapper adds two animation layers using `react-native-reanimated`:

### 1. Idle Bobbing

A gentle up-and-down floating motion that runs continuously:

```typescript
translateY.value = withRepeat(
  withSequence(
    withTiming(-4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
    withTiming(4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
  ),
  -1,     // -1 = repeat forever
  true    // reverse each iteration
);
```

### 2. Mood Transition

When the mood changes, a scale bounce + fade animation plays:

```typescript
// Scale: shrink slightly then spring back
scale.value = withSequence(
  withTiming(0.92, { duration: 150 }),
  withSpring(1, { damping: 8, stiffness: 120 })
);

// Opacity: brief fade
opacity.value = withSequence(
  withTiming(0.7, { duration: 100 }),
  withTiming(1, { duration: 300 })
);
```

### 3. Mood Message

Below the cow, a text message displays the current mood's message with the mood's color:

```typescript
const moodConfig = COW_MOODS[mood];
// Example: { message: "Keep drinking! You're doing great! 💧", color: "#38BDF8" }
```

## Sizing

The cow's default size is **160×160 points**. The SVG viewBox is `0 0 160 160`. The `size` prop scales the rendering:

```typescript
<CowMascot mood="happy" size={120} />  // Smaller
<CowMascot mood="happy" size={200} />  // Larger
```

## Reminder Screen Cow (`CowReminderAnimated.tsx`)

The reminders page uses a separate animated cow with slightly different animations (more pronounced bobbing, different mood message styling).
