/**
 * DrinkIcon — Specialized vector icons for drink containers (Glass, Cup, Mug, Bottle).
 * Styled to perfectly match the Feather line-art icon aesthetic.
 */
import React from 'react';
import { ColorValue } from 'react-native';
import Svg, { Path, Rect, Line } from 'react-native-svg';

export type DrinkContainerType = 'glass' | 'cup' | 'mug' | 'bottle';

interface DrinkIconProps {
  type: DrinkContainerType;
  size?: number;
  color?: ColorValue | string;
  strokeWidth?: number;
}

export function DrinkIcon({
  type,
  size = 22,
  color = '#0284C7',
  strokeWidth = 2,
}: DrinkIconProps) {
  switch (type) {
    case 'glass':
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
        >
          {/* Tapered water glass with water fill indicator */}
          <Path d="M6 3h12l-1.6 17.1a1.2 1.2 0 0 1-1.2.9H8.8a1.2 1.2 0 0 1-1.2-.9L6 3z" />
          <Line x1="7.4" y1="10" x2="16.6" y2="10" />
          <Line x1="8.2" y1="15" x2="15.8" y2="15" />
        </Svg>
      );

    case 'cup':
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
        >
          {/* Tumbler / cup with straw & lid */}
          <Line x1="12" y1="7" x2="15" y2="2" />
          <Line x1="15" y1="2" x2="18" y2="2" />
          <Rect x="5.5" y="7" width="13" height="2.5" rx="1" />
          <Path d="M6.5 9.5l1.2 11.6a1.2 1.2 0 0 0 1.2.9h6.2a1.2 1.2 0 0 0 1.2-.9l1.2-11.6" />
        </Svg>
      );

    case 'mug':
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
        >
          {/* Mug with curved handle and steam */}
          <Path d="M4.5 7h11.5v9.5a4 4 0 0 1-4 4H8.5a4 4 0 0 1-4-4V7z" />
          <Path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2" />
          <Path d="M8 2.5c0 1 .8 1.5.8 2.5" />
          <Path d="M12 2.5c0 1 .8 1.5.8 2.5" />
        </Svg>
      );

    case 'bottle':
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
        >
          {/* Water bottle with cap, shoulder, and grip band */}
          <Rect x="10" y="2" width="4" height="2.5" rx="0.5" />
          <Path d="M10.5 4.5h3v2h-3z" />
          <Path d="M8.5 8.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2l.5 12a1.5 1.5 0 0 1-1.5 1.5H9.5a1.5 1.5 0 0 1-1.5-1.5l.5-12z" />
          <Line x1="8.3" y1="14" x2="15.7" y2="14" />
        </Svg>
      );
  }
}
