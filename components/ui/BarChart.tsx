import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme, Typography, Spacing } from '../../constants/theme';

interface BarData {
  label: string;
  value: number;
  goal: number;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const { colors } = useTheme();
  // Use actual screen width minus card padding (xl*2 = 32px) minus card inner padding (lg*2 = 24px)
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth - 32 - 24 - 16; // account for scrollView + card padding

  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.goal)), 1);

  const spacingBetween = 10;
  const barWidth = Math.floor(
    (containerWidth - (data.length + 1) * spacingBetween) / data.length
  );
  const chartWidth = containerWidth;

  // Layout zones:
  //  [topPadding]  ← value label space
  //  [usableHeight] ← bar drawing area (both track and fill)
  //  [labelHeight]  ← day label space
  const labelHeight = 20;
  const topPadding = 20; // room for value labels above bars
  const usableHeight = height - topPadding - labelHeight;

  // Bottom of the usable bar area in SVG coordinates
  const barBottom = topPadding + usableHeight;

  const getGradientId = (progress: number) => {
    if (progress >= 1) return 'url(#grad_complete)';
    if (progress >= 0.75) return 'url(#grad_great)';
    if (progress >= 0.5) return 'url(#grad_good)';
    if (progress >= 0.25) return 'url(#grad_medium)';
    return 'url(#grad_low)';
  };

  // Fix: show ml as "0.25L" instead of raw "250"
  const formatValue = (val: number) => {
    if (val === 0) return '';
    if (val >= 1000) return `${(val / 1000).toFixed(1)}L`;
    // Sub-litre: show as decimal litres rounded to 2 sig figs
    return `${(val / 1000).toFixed(2).replace(/\.?0+$/, '')}L`;
  };

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
        <Defs>
          {/* Very Light Icy Blue Gradient (Low) */}
          <LinearGradient id="grad_low" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#EBF8FF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#BEE3F8" stopOpacity="0.85" />
          </LinearGradient>
          {/* Soft Light Blue Gradient (Medium) */}
          <LinearGradient id="grad_medium" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#90CDF4" stopOpacity="1" />
            <Stop offset="100%" stopColor="#63B3ED" stopOpacity="0.85" />
          </LinearGradient>
          {/* Classic Water Blue Gradient (Good) */}
          <LinearGradient id="grad_good" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#4299E1" stopOpacity="1" />
            <Stop offset="100%" stopColor="#3182CE" stopOpacity="0.85" />
          </LinearGradient>
          {/* Medium-Dark Blue Gradient (Great) */}
          <LinearGradient id="grad_great" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2B6CB0" stopOpacity="1" />
            <Stop offset="100%" stopColor="#2C5282" stopOpacity="0.85" />
          </LinearGradient>
          {/* Deep Navy/Royal Blue Gradient (Complete) */}
          <LinearGradient id="grad_complete" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2A4365" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1A202C" stopOpacity="0.85" />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid lines inside usable area */}
        {[0.25, 0.5, 0.75, 1.0].map((ratio, index) => {
          const yPos = barBottom - ratio * usableHeight;
          return (
            <Line
              key={index}
              x1={0}
              y1={yPos}
              x2={chartWidth}
              y2={yPos}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Goal line */}
        {data.length > 0 && data[0].goal > 0 && (
          <Line
            x1={0}
            y1={barBottom - (data[0].goal / maxValue) * usableHeight}
            x2={chartWidth}
            y2={barBottom - (data[0].goal / maxValue) * usableHeight}
            stroke={colors.primary}
            strokeWidth={1.5}
            opacity={0.35}
          />
        )}

        {data.map((d, i) => {
          // Bar fill height — no minimum that overflows; use barWidth as visual min for capsule
          const rawBarH = (d.value / maxValue) * usableHeight;
          const barH = d.value > 0 ? Math.max(rawBarH, barWidth) : 0;

          // Bar top Y — clamp so it never goes above topPadding
          const barY = Math.max(topPadding, barBottom - barH);
          // Actual rendered height (after clamping)
          const renderedBarH = barBottom - barY;

          // Goal track always spans the full usable height, anchored at barBottom
          const trackY = topPadding;

          // Value label: sit above the bar top, clamped to stay inside SVG
          const labelY = Math.max(topPadding - 4, barY - 5);

          const x = spacingBetween / 2 + i * (barWidth + spacingBetween);
          const progress = d.goal > 0 ? d.value / d.goal : 0;
          const gradientId = getGradientId(progress);

          return (
            <React.Fragment key={i}>
              {/* Goal track (full height background pill) */}
              <Rect
                x={x}
                y={trackY}
                width={barWidth}
                height={usableHeight}
                rx={barWidth / 2}
                fill={colors.surfaceBlueDark || '#BFDBFE'}
                opacity={0.25}
              />
              {/* Value fill bar */}
              {d.value > 0 && (
                <Rect
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={renderedBarH}
                  rx={barWidth / 2}
                  fill={gradientId}
                />
              )}
              {/* Value label — only when bar has data */}
              {d.value > 0 && (
                <SvgText
                  x={x + barWidth / 2}
                  y={labelY}
                  fontSize={9}
                  fill={colors.textSecondary}
                  textAnchor="middle"
                  fontFamily={Typography.fontFamily.semiBold}
                >
                  {formatValue(d.value)}
                </SvgText>
              )}
              {/* Day label */}
              <SvgText
                x={x + barWidth / 2}
                y={height - 4}
                fontSize={10}
                fill={colors.textTertiary}
                textAnchor="middle"
                fontFamily={Typography.fontFamily.medium}
              >
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
});
