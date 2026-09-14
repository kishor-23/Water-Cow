---
sidebar_position: 1
title: React Native Concepts
---

# React Native Concepts for Beginners

If you've never used React Native, this page explains the core concepts you'll encounter in the Water Cow codebase.

## What is React Native?

React Native lets you build **native mobile apps** using JavaScript/TypeScript and React. When you write:

```tsx
<Text>Hello World</Text>
```

React Native translates this to a real **native Android `TextView`** (or iOS `UILabel`). It's not a WebView or browser — it renders actual native UI components.

## Components

Everything in React Native is a **component** — a function that returns UI elements.

```tsx
// A simple component
function Greeting({ name }: { name: string }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  );
}

// Usage
<Greeting name="Buddy" />
```

### Core Components Used in Water Cow

| Component | What It Renders | HTML Equivalent |
|-----------|----------------|-----------------|
| `<View>` | A container (like a `div`) | `<div>` |
| `<Text>` | Text content | `<p>` or `<span>` |
| `<ScrollView>` | Scrollable container | `<div style="overflow: scroll">` |
| `<TouchableOpacity>` | Tappable element with fade effect | `<button>` |
| `<TextInput>` | Text input field | `<input>` |
| `<Image>` | Image display | `<img>` |

### SVG Components (from `react-native-svg`)

Water Cow uses SVG for the cow mascot and progress ring:

| Component | SVG Element |
|-----------|------------|
| `<Svg>` | `<svg>` |
| `<Circle>` | `<circle>` |
| `<Ellipse>` | `<ellipse>` |
| `<Path>` | `<path>` |
| `<Rect>` | `<rect>` |
| `<Line>` | `<line>` |
| `<G>` | `<g>` (group) |

## Props

Components receive data through **props** (properties). Props flow one way: parent → child.

```tsx
interface StatsCardProps {
  icon: string;    // Feather icon name
  value: string;   // "1.5 L"
  label: string;   // "Consumed"
  color?: string;  // Optional accent color
}

function StatsCard({ icon, value, label, color }: StatsCardProps) {
  // ...
}
```

## State

**State** is data that a component manages internally and can change over time.

```tsx
function Counter() {
  // useState returns [currentValue, setterFunction]
  const [count, setCount] = useState(0);

  return (
    <TouchableOpacity onPress={() => setCount(count + 1)}>
      <Text>Count: {count}</Text>
    </TouchableOpacity>
  );
}
```

When state changes, React **re-renders** the component with the new value.

## JSX / TSX

The HTML-like syntax in React components is called **JSX** (or TSX for TypeScript). It's syntactic sugar for function calls:

```tsx
// This JSX:
<View style={styles.container}>
  <Text>Hello</Text>
</View>

// Compiles to:
React.createElement(View, { style: styles.container },
  React.createElement(Text, null, "Hello")
);
```

Key JSX rules:
- JavaScript expressions go in `{curly braces}`
- `className` doesn't exist — use `style` prop
- No `class` — use `function` components
- Conditional rendering: `{condition && <Component />}`

## StyleSheet

React Native doesn't use CSS files. Styles are JavaScript objects:

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C4A6E',
  },
});

// Usage
<View style={styles.container}>
  <Text style={styles.title}>Water Cow</Text>
</View>
```

Style names use **camelCase** instead of kebab-case:
- CSS: `background-color` → RN: `backgroundColor`
- CSS: `font-size` → RN: `fontSize`
- CSS: `border-radius` → RN: `borderRadius`

## Flexbox Layout

React Native uses **Flexbox** for layout, similar to CSS Flexbox but with different defaults:
- `flexDirection` defaults to `'column'` (not `'row'`)
- `flex: 1` makes an element fill available space

```tsx
<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

## Re-Rendering

When state or props change, React re-renders the component. This means:
1. The function runs again
2. It returns new JSX
3. React compares old and new JSX (reconciliation)
4. Only **changed** parts update the actual native views

This is why React is efficient — it doesn't rebuild everything, just the differences.
