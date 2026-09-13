import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.goal)), 1);
  
  // Dynamic bar width adjustment based on item count
  const containerWidth = 320;
  const spacingBetween = 14;
  const barWidth = Math.min(28, (containerWidth - (data.length + 1) * spacingBetween) / data.length);
  const chartWidth = data.length * (barWidth + spacingBetween) + spacingBetween;
  
  const chartHeight = height - 30;
  const topPadding = 22;
  const usableHeight = chartHeight - topPadding;

  const getGradientId = (progress: number) => {
    if (progress >= 1) return 'url(#grad_complete)';
    if (progress >= 0.75) return 'url(#grad_great)';
    if (progress >= 0.5) return 'url(#grad_good)';
    if (progress >= 0.25) return 'url(#grad_medium)';
    return 'url(#grad_low)';
  };

  const formatValue = (val: number) => {
    if (val === 0) return '';
    return val >= 1000 ? `${(val / 1000).toFixed(1)}L` : `${val}`;
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

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1.0].map((ratio, index) => {
          const yPos = chartHeight - (ratio * usableHeight);
          return (
            <Line
              key={index}
              x1={spacingBetween}
              y1={yPos}
              x2={chartWidth - spacingBetween}
              y2={yPos}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Goal line (solid, more subtle) */}
        {data.length > 0 && data[0].goal > 0 && (
          <Line
            x1={spacingBetween}
            y1={chartHeight - (data[0].goal / maxValue) * usableHeight}
            x2={chartWidth - spacingBetween}
            y2={chartHeight - (data[0].goal / maxValue) * usableHeight}
            stroke={colors.primary}
            strokeWidth={1.5}
            opacity={0.35}
          />
        )}

        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * usableHeight;
          const x = i * (barWidth + spacingBetween) + spacingBetween;
          const y = chartHeight - barHeight;
          const progress = d.goal > 0 ? d.value / d.goal : 0;
          const gradientId = getGradientId(progress);

          return (
            <React.Fragment key={i}>
              {/* Bar background (light track) */}
              <Rect
                x={x}
                y={topPadding}
                width={barWidth}
                height={usableHeight}
                rx={barWidth / 2}
                fill={colors.surfaceBlueDark}
                opacity={0.25}
              />
              {/* Bar fill */}
              {d.value > 0 && (
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, barWidth)} // Ensure some minimum height/capsule shape
                  rx={barWidth / 2}
                  fill={gradientId}
                />
              )}
              {/* Exact Value Text */}
              {d.value > 0 && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
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
