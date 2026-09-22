/**
 * FeatherIcon — Inline SVG replacement for @expo/vector-icons Feather.
 * Contains only the icons actually used in Water Cow.
 * Eliminates the 1.25 MB Feather font file and all other @expo/vector-icons fonts.
 */
import React from 'react';
import { ColorValue } from 'react-native';
import { G, Path, Polyline, Line, Circle, Rect, Polygon, Svg } from 'react-native-svg';

const ICONS: Record<string, React.ReactNode> = {
  'bell': (
    <G>
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </G>
  ),
  'bell-off': (
    <G>
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <Path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
      <Path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
      <Path d="M18 8a6 6 0 0 0-9.33-5" />
      <Line x1="1" y1="1" x2="23" y2="23" />
    </G>
  ),
  'calendar': (
    <G>
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </G>
  ),
  'check': (
    <Polyline points="20 6 9 17 4 12" />
  ),
  'check-circle': (
    <G>
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </G>
  ),
  'chevron-down': (
    <Polyline points="6 9 12 15 18 9" />
  ),
  'chevron-left': (
    <Polyline points="15 18 9 12 15 6" />
  ),
  'chevron-right': (
    <Polyline points="9 18 15 12 9 6" />
  ),
  'clock': (
    <G>
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
    </G>
  ),
  'coffee': (
    <G>
      <Path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <Path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <Line x1="6" y1="1" x2="6" y2="4" />
      <Line x1="10" y1="1" x2="10" y2="4" />
      <Line x1="14" y1="1" x2="14" y2="4" />
    </G>
  ),
  'download': (
    <G>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Polyline points="7 10 12 15 17 10" />
      <Line x1="12" y1="15" x2="12" y2="3" />
    </G>
  ),
  'download-cloud': (
    <G>
      <Polyline points="8 17 12 21 16 17" />
      <Line x1="12" y1="12" x2="12" y2="21" />
      <Path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
    </G>
  ),
  'droplet': (
    <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  ),
  'edit-2': (
    <G>
      <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </G>
  ),
  'edit-3': (
    <G>
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </G>
  ),
  'grid': (
    <G>
      <Rect x="3" y="3" width="7" height="7" />
      <Rect x="14" y="3" width="7" height="7" />
      <Rect x="14" y="14" width="7" height="7" />
      <Rect x="3" y="14" width="7" height="7" />
    </G>
  ),
  'hard-drive': (
    <G>
      <Line x1="22" y1="12" x2="2" y2="12" />
      <Path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <Line x1="6" y1="16" x2="6.01" y2="16" />
      <Line x1="10" y1="16" x2="10.01" y2="16" />
    </G>
  ),
  'heart': (
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  'home': (
    <G>
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </G>
  ),
  'info': (
    <G>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
    </G>
  ),
  'minus': (
    <Line x1="5" y1="12" x2="19" y2="12" />
  ),
  'moon': (
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  ),
  'plus': (
    <G>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </G>
  ),
  'plus-circle': (
    <G>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="16" />
      <Line x1="8" y1="12" x2="16" y2="12" />
    </G>
  ),
  'sliders': (
    <G>
      <Line x1="4" y1="21" x2="4" y2="14" />
      <Line x1="4" y1="10" x2="4" y2="3" />
      <Line x1="12" y1="21" x2="12" y2="12" />
      <Line x1="12" y1="8" x2="12" y2="3" />
      <Line x1="20" y1="21" x2="20" y2="16" />
      <Line x1="20" y1="12" x2="20" y2="3" />
      <Line x1="1" y1="14" x2="7" y2="14" />
      <Line x1="9" y1="8" x2="15" y2="8" />
      <Line x1="17" y1="16" x2="23" y2="16" />
    </G>
  ),
  'smartphone': (
    <G>
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <Line x1="12" y1="18" x2="12.01" y2="18" />
    </G>
  ),
  'sun': (
    <G>
      <Circle cx="12" cy="12" r="5" />
      <Line x1="12" y1="1" x2="12" y2="3" />
      <Line x1="12" y1="21" x2="12" y2="23" />
      <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <Line x1="1" y1="12" x2="3" y2="12" />
      <Line x1="21" y1="12" x2="23" y2="12" />
      <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </G>
  ),
  'target': (
    <G>
      <Circle cx="12" cy="12" r="10" />
      <Circle cx="12" cy="12" r="6" />
      <Circle cx="12" cy="12" r="2" />
    </G>
  ),
  'trash-2': (
    <G>
      <Polyline points="3 6 5 6 21 6" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <Line x1="10" y1="11" x2="10" y2="17" />
      <Line x1="14" y1="11" x2="14" y2="17" />
    </G>
  ),
  'upload-cloud': (
    <G>
      <Polyline points="16 16 12 12 8 16" />
      <Line x1="12" y1="12" x2="12" y2="21" />
      <Path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </G>
  ),
  'user': (
    <G>
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </G>
  ),
  'x': (
    <G>
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </G>
  ),
};

interface FeatherIconProps {
  name: string;
  size?: number;
  color?: ColorValue | string;
  strokeWidth?: number;
  style?: object;
}

export function FeatherIcon({ name, size = 24, color = '#000', strokeWidth = 2, style }: FeatherIconProps) {
  const icon = ICONS[name];
  if (!icon) {
    console.warn(`FeatherIcon: unknown icon "${name}"`);
    return null;
  }
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {icon}
    </Svg>
  );
}
