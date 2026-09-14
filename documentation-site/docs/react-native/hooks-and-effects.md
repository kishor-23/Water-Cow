---
sidebar_position: 3
title: Hooks & Effects
---

# Hooks and Effects

React hooks are functions that let you use React features (state, lifecycle, context) inside function components. Water Cow uses these hooks extensively.

## useState — Local State

Stores a value that causes re-renders when changed.

```tsx
const [count, setCount] = useState(0);

// Update
setCount(5);          // Set to 5
setCount(c => c + 1); // Increment by 1
```

**Used in Water Cow**: `SegmentedControl` tracks its width for indicator positioning, `ThemeContext` stores the theme mode.

## useEffect — Side Effects

Runs code **after** render. Used for data fetching, subscriptions, DOM manipulation.

```tsx
useEffect(() => {
  // This runs after every render where `entries` changes
  saveTodayEntries(entries);
}, [entries]); // Dependency array — only re-run when entries changes
```

### Dependency Array Rules

| Pattern | When It Runs |
|---------|-------------|
| `useEffect(() => {}, [])` | Once, on mount only |
| `useEffect(() => {}, [a, b])` | When `a` or `b` changes |
| `useEffect(() => {})` | After every render (rarely used) |

**Used in Water Cow**:
- `HydrationContext`: Persists entries to AsyncStorage, updates widget
- `CowAnimated`: Starts idle bobbing animation on mount
- `ProgressRing`: Animates progress value when it changes

## useReducer — Complex State

Like `useState` but for state with multiple sub-values or complex update logic.

```tsx
const [state, dispatch] = useReducer(reducer, initialState);

// Dispatch an action
dispatch({ type: 'ADD_WATER', payload: { amount: 250 } });

// Reducer handles the action
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_WATER':
      return {
        ...state,
        totalConsumed: state.totalConsumed + action.payload.amount,
        entries: [...state.entries, newEntry],
      };
    default:
      return state;
  }
}
```

**Used in Water Cow**: `HydrationContext` manages all water tracking state through a single reducer.

## useContext — Global State Access

Reads a value from a React Context (global state).

```tsx
// Provider wraps the app (in _layout.tsx)
<HydrationProvider>
  <App />
</HydrationProvider>

// Any child can read the context
function HomeScreen() {
  const { state, addWater } = useHydration(); // Custom hook wrapping useContext
}
```

**Used in Water Cow**: Every screen uses `useHydration()` and `useTheme()`.

## useMemo — Cached Computation

Memoizes an expensive computation so it's only recalculated when dependencies change.

```tsx
const sortedHistory = useMemo(() => {
  return history.sort((a, b) => b.date.localeCompare(a.date));
}, [history]); // Only re-sort when history changes
```

## useCallback — Cached Function Reference

Memoizes a function so it keeps the same reference between renders. Useful for passing callbacks to child components.

```tsx
const handleAddWater = useCallback((amount: number) => {
  dispatch({ type: 'ADD_WATER', payload: { amount } });
}, [dispatch]);
```

## Reanimated Hooks

Water Cow uses hooks from `react-native-reanimated` for 60fps animations:

### useSharedValue

Creates a value that can be animated on the UI thread (not the JS thread):

```tsx
const translateY = useSharedValue(0);
translateY.value = withTiming(100, { duration: 500 });
```

### useAnimatedStyle

Creates a style object driven by shared values:

```tsx
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
}));

<Animated.View style={animatedStyle}>
```

### useAnimatedProps

Like `useAnimatedStyle` but for component props (used for SVG animations):

```tsx
const animatedProps = useAnimatedProps(() => ({
  strokeDashoffset: circumference * (1 - progress.value),
}));

<AnimatedCircle animatedProps={animatedProps} />
```
