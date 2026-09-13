/**
 * CowMascot — SVG cow character with 5 mood variants.
 *
 * A friendly black-and-white cow rendered as an SVG.
 * The cow's expression and accessories change based on mood.
 */
import React from 'react';
import Svg, {
  G, Circle, Ellipse, Path, Rect, Line,
} from 'react-native-svg';
import type { CowMood } from '../../constants/cowMoods';

interface CowMascotProps {
  mood: CowMood;
  size?: number;
}

export function CowMascot({ mood, size = 160 }: CowMascotProps) {
  const scale = size / 160;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
    >
      <G transform="translate(80, 85)" scale={scale > 1 ? 1 : 1}>
        {/* Body */}
        <Ellipse cx={0} cy={20} rx={38} ry={32} fill="#F5F0EB" />
        {/* Body spots */}
        <Ellipse cx={-12} cy={14} rx={10} ry={8} fill="#2D2D2D" opacity={0.85} />
        <Ellipse cx={15} cy={28} rx={8} ry={6} fill="#2D2D2D" opacity={0.85} />

        {/* Head */}
        <Ellipse cx={0} cy={-16} rx={32} ry={28} fill="#F5F0EB" />

        {/* Head spots */}
        <Ellipse cx={12} cy={-28} rx={14} ry={10} fill="#2D2D2D" opacity={0.85} />

        {/* Ears */}
        <Ellipse cx={-32} cy={-26} rx={12} ry={7} fill="#2D2D2D" transform="rotate(-25 -32 -26)" />
        <Ellipse cx={-30} cy={-26} rx={8} ry={4} fill="#FFB6C1" transform="rotate(-25 -30 -26)" />
        <Ellipse cx={32} cy={-26} rx={12} ry={7} fill="#2D2D2D" transform="rotate(25 32 -26)" />
        <Ellipse cx={30} cy={-26} rx={8} ry={4} fill="#FFB6C1" transform="rotate(25 30 -26)" />

        {/* Horns */}
        <Path d="M -18 -40 Q -20 -54 -14 -52" stroke="#E8C96E" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <Path d="M 18 -40 Q 20 -54 14 -52" stroke="#E8C96E" strokeWidth={3.5} fill="none" strokeLinecap="round" />

        {/* Snout */}
        <Ellipse cx={0} cy={-2} rx={16} ry={11} fill="#FCDCC8" />
        {/* Nostrils */}
        <Ellipse cx={-5} cy={-1} rx={2.5} ry={2} fill="#D4A88C" />
        <Ellipse cx={5} cy={-1} rx={2.5} ry={2} fill="#D4A88C" />

        {/* Cheeks (blush) */}
        {(mood === 'happy' || mood === 'goalComplete') && (
          <>
            <Ellipse cx={-22} cy={-6} rx={6} ry={4} fill="#FFB6C1" opacity={0.35} />
            <Ellipse cx={22} cy={-6} rx={6} ry={4} fill="#FFB6C1" opacity={0.35} />
          </>
        )}

        {/* Eyes — change based on mood */}
        {renderEyes(mood)}

        {/* Mouth — change based on mood */}
        {renderMouth(mood)}

        {/* Bell */}
        <Line x1={0} y1={6} x2={0} y2={12} stroke="#8B6914" strokeWidth={1.5} />
        <Circle cx={0} cy={14} r={5} fill="#FFD700" />
        <Circle cx={0} cy={15} r={1.5} fill="#DAA520" />

        {/* Glass of water */}
        {renderGlass(mood)}
      </G>
    </Svg>
  );
}

function renderEyes(mood: CowMood) {
  switch (mood) {
    case 'happy':
      // Squinting happy eyes (arcs)
      return (
        <>
          <Path d="M -14 -18 Q -11 -22 -8 -18" stroke="#2D2D2D" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M 8 -18 Q 11 -22 14 -18" stroke="#2D2D2D" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      );

    case 'goalComplete':
      // Star/sparkle eyes
      return (
        <>
          <Path d="M -14 -18 Q -11 -23 -8 -18" stroke="#2D2D2D" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M 8 -18 Q 11 -23 14 -18" stroke="#2D2D2D" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {/* Sparkles */}
          <Path d="M -20 -28 L -18 -24 L -16 -28 L -18 -32 Z" fill="#FFD700" opacity={0.8} />
          <Path d="M 20 -28 L 18 -24 L 16 -28 L 18 -32 Z" fill="#FFD700" opacity={0.8} />
        </>
      );

    case 'reminder':
      // Normal open eyes looking at glass
      return (
        <>
          <Circle cx={-11} cy={-18} r={4} fill="white" />
          <Circle cx={-10} cy={-18} r={2.5} fill="#2D2D2D" />
          <Circle cx={11} cy={-18} r={4} fill="white" />
          <Circle cx={12} cy={-18} r={2.5} fill="#2D2D2D" />
        </>
      );

    case 'tired':
      // Half-closed/droopy eyes
      return (
        <>
          <Ellipse cx={-11} cy={-17} rx={4} ry={2.5} fill="white" />
          <Circle cx={-11} cy={-16} r={2} fill="#2D2D2D" />
          <Path d="M -15 -20 L -7 -19" stroke="#2D2D2D" strokeWidth={1.5} strokeLinecap="round" />
          <Ellipse cx={11} cy={-17} rx={4} ry={2.5} fill="white" />
          <Circle cx={11} cy={-16} r={2} fill="#2D2D2D" />
          <Path d="M 7 -19 L 15 -20" stroke="#2D2D2D" strokeWidth={1.5} strokeLinecap="round" />
        </>
      );

    case 'dehydrated':
      // Sad, droopy eyes
      return (
        <>
          <Circle cx={-11} cy={-16} r={4} fill="white" />
          <Circle cx={-11} cy={-15} r={2.5} fill="#2D2D2D" />
          <Circle cx={-9} cy={-16.5} r={1} fill="white" />
          <Path d="M -16 -22 L -7 -20" stroke="#2D2D2D" strokeWidth={1.8} strokeLinecap="round" />

          <Circle cx={11} cy={-16} r={4} fill="white" />
          <Circle cx={11} cy={-15} r={2.5} fill="#2D2D2D" />
          <Circle cx={13} cy={-16.5} r={1} fill="white" />
          <Path d="M 7 -20 L 16 -22" stroke="#2D2D2D" strokeWidth={1.8} strokeLinecap="round" />

          {/* Tear drop */}
          <Path d="M -7 -13 Q -6 -10 -7 -8" stroke="#87CEEB" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </>
      );

    default:
      return null;
  }
}

function renderMouth(mood: CowMood) {
  switch (mood) {
    case 'happy':
    case 'goalComplete':
      // Big smile
      return <Path d="M -8 -8 Q 0 -2 8 -8" stroke="#2D2D2D" strokeWidth={2} fill="none" strokeLinecap="round" />;

    case 'reminder':
      // Neutral / slight smile
      return <Path d="M -5 -8 Q 0 -5 5 -8" stroke="#2D2D2D" strokeWidth={1.8} fill="none" strokeLinecap="round" />;

    case 'tired':
      // Slightly downturned
      return <Path d="M -5 -7 Q 0 -8 5 -7" stroke="#2D2D2D" strokeWidth={1.8} fill="none" strokeLinecap="round" />;

    case 'dehydrated':
      // Sad frown
      return <Path d="M -6 -6 Q 0 -10 6 -6" stroke="#2D2D2D" strokeWidth={2} fill="none" strokeLinecap="round" />;

    default:
      return null;
  }
}

function renderGlass(mood: CowMood) {
  const glassX = 32;
  const glassY = 5;

  // Water level varies by mood
  let waterHeight = 16;
  let waterColor = '#87CEEB';

  switch (mood) {
    case 'happy':
      waterHeight = 14;
      waterColor = '#7BC8F6';
      break;
    case 'goalComplete':
      waterHeight = 18;
      waterColor = '#5BB5E8';
      break;
    case 'reminder':
      waterHeight = 12;
      waterColor = '#87CEEB';
      break;
    case 'tired':
      waterHeight = 6;
      waterColor = '#A8D8EA';
      break;
    case 'dehydrated':
      waterHeight = 2;
      waterColor = '#C8E6F0';
      break;
  }

  return (
    <G>
      {/* Glass outline */}
      <Path
        d={`M ${glassX - 8} ${glassY - 10} L ${glassX - 6} ${glassY + 12} Q ${glassX} ${glassY + 14} ${glassX + 6} ${glassY + 12} L ${glassX + 8} ${glassY - 10} Z`}
        fill="rgba(200, 230, 255, 0.3)"
        stroke="#B0D4F1"
        strokeWidth={1.2}
      />
      {/* Water fill */}
      <Rect
        x={glassX - 6}
        y={glassY + 12 - waterHeight}
        width={12}
        height={waterHeight}
        fill={waterColor}
        opacity={0.6}
        rx={2}
      />
      {/* Glass shine */}
      <Line
        x1={glassX - 5}
        y1={glassY - 8}
        x2={glassX - 4}
        y2={glassY + 4}
        stroke="white"
        strokeWidth={1.5}
        opacity={0.5}
        strokeLinecap="round"
      />
    </G>
  );
}
