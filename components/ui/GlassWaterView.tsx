/**
 * GlassWaterView — Realistic Glass with Continuous Moving Water Flow Animation.
 * Features dual-layer rolling fluid waves, continuous rising bubble streams,
 * smooth water filling transitions, and multiple animated daily glasses.
 * 100% Cross-Platform (iOS, Android, and Web) with no DOM attribute warnings.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Rect,
  Circle,
  Line,
  G,
  ClipPath,
  Text as SvgText,
} from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { formatWater } from '../../utils/hydration';

interface GlassWaterViewProps {
  consumed: number;
  goal: number;
  onQuickAdd?: (amount: number) => void;
}

const GLASS_SIZE_ML = 250; // Standard 250ml per cup

export function GlassWaterView({ consumed, goal, onQuickAdd }: GlassWaterViewProps) {
  const { colors, isDark } = useTheme();

  // Mode: 'single' (Big Fluid Tumbler) or 'multi' (8 Daily Glasses)
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');

  // Water level animation (smooth level rise)
  const [displayedConsumed, setDisplayedConsumed] = useState(consumed);
  const fillAnim = useRef(new Animated.Value(consumed)).current;

  // Real-time Wave & Bubble Phase driven by 60fps frame loop
  const [wavePhase, setWavePhase] = useState(0);

  const progress = goal > 0 ? Math.min(displayedConsumed / goal, 1.15) : 0;
  const percentNumber = Math.round(goal > 0 ? (consumed / goal) * 100 : 0);

  // Multi-glass counts
  const totalGlasses = Math.max(4, Math.round(goal / GLASS_SIZE_ML));
  const fullGlassesCount = Math.floor(consumed / GLASS_SIZE_ML);
  const partialGlassFill = (consumed % GLASS_SIZE_ML) / GLASS_SIZE_ML;

  // 1. Water Level Fill Animation
  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: consumed,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const listenerId = fillAnim.addListener(({ value }) => {
      setDisplayedConsumed(value);
    });

    return () => fillAnim.removeListener(listenerId);
  }, [consumed]);

  // Glass Shake & Dynamic Water Slosh Animation on Tap
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const waveSplashAnim = useRef(new Animated.Value(0)).current;
  const [extraWaveAmp, setExtraWaveAmp] = useState(0);

  useEffect(() => {
    const listenerId = waveSplashAnim.addListener(({ value }) => {
      setExtraWaveAmp(value);
    });
    return () => waveSplashAnim.removeListener(listenerId);
  }, []);

  const triggerShake = () => {
    shakeAnim.setValue(0);
    waveSplashAnim.setValue(0);

    // 1. Physical Glass Wobble
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 70,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 70,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 60,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 2,
        duration: 50,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 40,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Liquid Water Wave Slosh & Amplitude Surge
    Animated.sequence([
      Animated.timing(waveSplashAnim, {
        toValue: 12,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(waveSplashAnim, {
        toValue: -7,
        duration: 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(waveSplashAnim, {
        toValue: 3,
        duration: 120,
        easing: Easing.out(Easing.sin),
        useNativeDriver: false,
      }),
      Animated.timing(waveSplashAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const shakeRotate = shakeAnim.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-4.5deg', '4.5deg'],
  });

  // Trigger shake when consumed increases
  useEffect(() => {
    if (consumed > 0) {
      triggerShake();
    }
  }, [consumed]);

  // 2. 60fps Continuous Wave & Bubble Frame Loop (Zero React-DOM collapsable issues)
  useEffect(() => {
    let animId: number;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      // Loop phase 0 -> 1 every 3200ms
      const phase = (elapsed % 3200) / 3200;
      setWavePhase(phase);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Glass dimensions
  const glassHeight = 185;
  const topWidth = 125;
  const bottomWidth = 92;
  const topY = 15;
  const bottomY = topY + glassHeight;
  const centerX = 160;

  const leftTopX = centerX - topWidth / 2;
  const rightTopX = centerX + topWidth / 2;
  const leftBottomX = centerX - bottomWidth / 2;
  const rightBottomX = centerX + bottomWidth / 2;

  const innerTopY = topY + 10;
  const innerBottomY = bottomY - 12;
  const maxWaterHeight = innerBottomY - innerTopY;
  const currentWaterHeight = maxWaterHeight * Math.min(progress, 1);
  const waterSurfaceY = innerBottomY - currentWaterHeight;

  const ticks = [0.25, 0.5, 0.75, 1.0];

  // Calculate Wave X offsets based on phase
  const wave1OffsetX = -(wavePhase * 160);
  const wave2OffsetX = -((1 - ((wavePhase * 1.3) % 1)) * 160);

  // Bubble positions and opacities calculated directly from wavePhase
  const b1Progress = (wavePhase * 1.25) % 1;
  const b1Y = innerBottomY - (innerBottomY - waterSurfaceY - 6) * b1Progress;
  const b1Opacity = b1Progress < 0.1 ? b1Progress * 8 : b1Progress > 0.85 ? (1 - b1Progress) * 6 : 0.75;

  const b2Progress = ((wavePhase * 0.95 + 0.35) % 1);
  const b2Y = innerBottomY - (innerBottomY - waterSurfaceY - 8) * b2Progress;
  const b2Opacity = b2Progress < 0.1 ? b2Progress * 7 : b2Progress > 0.85 ? (1 - b2Progress) * 6 : 0.7;

  const b3Progress = ((wavePhase * 1.1 + 0.65) % 1);
  const b3Y = innerBottomY - (innerBottomY - waterSurfaceY - 5) * b3Progress;
  const b3Opacity = b3Progress < 0.1 ? b3Progress * 8 : b3Progress > 0.85 ? (1 - b3Progress) * 6 : 0.8;

  const b4Progress = ((wavePhase * 0.85 + 0.15) % 1);
  const b4Y = innerBottomY - (innerBottomY - waterSurfaceY - 10) * b4Progress;
  const b4Opacity = b4Progress < 0.1 ? b4Progress * 7 : b4Progress > 0.85 ? (1 - b4Progress) * 6 : 0.65;

  // Continuous Seamless Wave Path (Wavelength = 160px, spans 480px)
  const makeWavePath = (offsetX: number, baseY: number, amp: number = 7) => `
    M ${offsetX} ${baseY}
    Q ${offsetX + 40} ${baseY - amp} ${offsetX + 80} ${baseY}
    T ${offsetX + 160} ${baseY}
    Q ${offsetX + 200} ${baseY - amp} ${offsetX + 240} ${baseY}
    T ${offsetX + 320} ${baseY}
    Q ${offsetX + 360} ${baseY - amp} ${offsetX + 400} ${baseY}
    T ${offsetX + 480} ${baseY}
    L ${offsetX + 480} ${innerBottomY + 30}
    L ${offsetX} ${innerBottomY + 30}
    Z
  `;

  return (
    <View style={styles.container}>
      {/* View Mode Switcher */}
      <View style={[styles.toggleContainer, { backgroundColor: colors.surfaceBlue }]}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewMode === 'single' && [styles.toggleBtnActive, { backgroundColor: colors.primary }],
          ]}
          onPress={() => setViewMode('single')}
          activeOpacity={0.8}
        >
          <Feather
            name="droplet"
            size={14}
            color={viewMode === 'single' ? colors.textOnPrimary : colors.textSecondary}
          />
          <Text
            style={[
              styles.toggleBtnText,
              { color: viewMode === 'single' ? colors.textOnPrimary : colors.textSecondary },
            ]}
          >
            Flowing Glass 🌊
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewMode === 'multi' && [styles.toggleBtnActive, { backgroundColor: colors.primary }],
          ]}
          onPress={() => setViewMode('multi')}
          activeOpacity={0.8}
        >
          <Feather
            name="grid"
            size={14}
            color={viewMode === 'multi' ? colors.textOnPrimary : colors.textSecondary}
          />
          <Text
            style={[
              styles.toggleBtnText,
              { color: viewMode === 'multi' ? colors.textOnPrimary : colors.textSecondary },
            ]}
          >
            Daily Glasses ({totalGlasses})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mode 1: Moving Water Flow Glass */}
      {viewMode === 'single' && (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => {
            triggerShake();
          }}
          style={styles.singleTouchContainer}
        >
          <Animated.View
            style={[
              styles.singleViewWrapper,
              {
                transform: [
                  { translateX: shakeAnim },
                  { rotate: shakeRotate },
                ],
              },
            ]}
          >
            <Svg width={320} height={230} viewBox="0 0 320 230">
              <Defs>
                {/* Front Flowing Wave Gradient */}
                <LinearGradient id="waveFrontGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.94" />
                  <Stop offset="35%" stopColor="#0EA5E9" stopOpacity="0.95" />
                  <Stop offset="100%" stopColor="#0284C7" stopOpacity="0.98" />
                </LinearGradient>

                {/* Back Wave Gradient */}
                <LinearGradient id="waveBackGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.75" />
                  <Stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <Stop offset="100%" stopColor="#0369A1" stopOpacity="0.85" />
                </LinearGradient>

                {/* Glass Wall Reflection Gradient */}
                <LinearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                  <Stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.1" />
                  <Stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.02" />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
                </LinearGradient>

                {/* Glass Inner Tint */}
                <LinearGradient id="glassBg" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={isDark ? '#1E293B' : '#E0F2FE'} stopOpacity="0.4" />
                  <Stop offset="100%" stopColor={isDark ? '#0F172A' : '#BAE6FD'} stopOpacity="0.6" />
                </LinearGradient>

                {/* Clip Path for the interior cavity of the tumbler */}
                <ClipPath id="glassInnerClip">
                  <Path
                    d={`
                      M ${leftTopX + 5} ${innerTopY}
                      L ${rightTopX - 5} ${innerTopY}
                      L ${rightBottomX - 6} ${innerBottomY}
                      Q ${centerX} ${innerBottomY + 8} ${leftBottomX + 6} ${innerBottomY}
                      Z
                    `}
                  />
                </ClipPath>
              </Defs>

              {/* Bottom Surface Drop Shadow */}
              <Path
                d={`M ${leftBottomX - 10} ${bottomY + 6} Q ${centerX} ${bottomY + 14} ${rightBottomX + 10} ${bottomY + 6} Q ${centerX} ${bottomY - 2} ${leftBottomX - 10} ${bottomY + 6}`}
                fill="rgba(0,0,0,0.12)"
                opacity={0.35}
              />

              {/* Glass Interior Body Tint */}
              <Path
                d={`
                  M ${leftTopX + 4} ${innerTopY}
                  L ${rightTopX - 4} ${innerTopY}
                  L ${rightBottomX - 5} ${innerBottomY}
                  Q ${centerX} ${innerBottomY + 6} ${leftBottomX + 5} ${innerBottomY}
                  Z
                `}
                fill="url(#glassBg)"
              />

              {/* Moving Water Flow (Clipped inside glass) */}
              <G clipPath="url(#glassInnerClip)">
                {displayedConsumed > 0 && (
                  <>
                    {/* Deep Water Base Fill */}
                    <Rect
                      x={leftTopX - 20}
                      y={waterSurfaceY + 4}
                      width={topWidth + 40}
                      height={innerBottomY - waterSurfaceY + 20}
                      fill="url(#waveFrontGrad)"
                    />

                    {/* 1. Back Rolling Wave (Opposite Flow) */}
                    <Path
                      d={makeWavePath(wave2OffsetX, waterSurfaceY - 2, 6 + Math.abs(extraWaveAmp) * 0.7)}
                      fill="url(#waveBackGrad)"
                    />

                    {/* 2. Front Rolling Wave (Main Flow) */}
                    <Path
                      d={makeWavePath(wave1OffsetX, waterSurfaceY, 8 + Math.abs(extraWaveAmp))}
                      fill="url(#waveFrontGrad)"
                    />

                    {/* 3. Dynamic Rising Ambient Bubbles */}
                    <Circle
                      cx={centerX - 24}
                      cy={b1Y}
                      r={3.5}
                      fill="#FFFFFF"
                      opacity={b1Opacity}
                    />
                    <Circle
                      cx={centerX + 26}
                      cy={b2Y}
                      r={4.5}
                      fill="#FFFFFF"
                      opacity={b2Opacity}
                    />
                    <Circle
                      cx={centerX - 8}
                      cy={b3Y}
                      r={2.5}
                      fill="#FFFFFF"
                      opacity={b3Opacity}
                    />
                    <Circle
                      cx={centerX + 12}
                      cy={b4Y}
                      r={3}
                      fill="#FFFFFF"
                      opacity={b4Opacity}
                    />
                  </>
                )}
              </G>

              {/* Measurement Ticks & Goal Labels */}
              {ticks.map((t) => {
                const tickY = innerBottomY - maxWaterHeight * t;
                const tickAmount = Math.round(goal * t);
                const isGoal = t === 1.0;
                return (
                  <G key={t}>
                    <Line
                      x1={rightTopX - 18}
                      y1={tickY}
                      x2={rightTopX - 6}
                      y2={tickY}
                      stroke={isGoal ? '#38BDF8' : colors.textTertiary}
                      strokeWidth={isGoal ? 2 : 1}
                      opacity={0.85}
                    />
                    <SvgText
                      x={rightTopX + 6}
                      y={tickY + 3.5}
                      fontSize={10}
                      fontFamily={Typography.fontFamily.semiBold}
                      fill={isGoal ? colors.primary : colors.textTertiary}
                      textAnchor="start"
                    >
                      {isGoal ? `Goal ${formatWater(goal)}` : formatWater(tickAmount)}
                    </SvgText>
                  </G>
                );
              })}

              {/* Outer Silhouette & Rim */}
              <Path
                d={`
                  M ${leftTopX} ${topY}
                  L ${rightTopX} ${topY}
                  L ${rightBottomX} ${bottomY}
                  Q ${centerX} ${bottomY + 10} ${leftBottomX} ${bottomY}
                  Z
                `}
                fill="url(#glassReflection)"
                stroke={isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8'}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />

              {/* Glass Base */}
              <Path
                d={`
                  M ${leftBottomX} ${bottomY}
                  L ${rightBottomX} ${bottomY}
                  Q ${centerX} ${bottomY + 10} ${leftBottomX} ${bottomY}
                `}
                fill={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(203,213,225,0.7)'}
                stroke={isDark ? 'rgba(255,255,255,0.3)' : '#64748B'}
                strokeWidth={1.5}
              />

              {/* Glass Highlights */}
              <Line
                x1={leftTopX + 8}
                y1={topY + 12}
                x2={leftBottomX + 9}
                y2={bottomY - 14}
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.7}
              />
              <Line
                x1={leftTopX + 15}
                y1={topY + 20}
                x2={leftBottomX + 16}
                y2={bottomY - 24}
                stroke="#FFFFFF"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.45}
              />

              {/* Percentage Badge */}
              {displayedConsumed > 0 && (
                <G>
                  <Rect
                    x={centerX - 36}
                    y={Math.max(waterSurfaceY - 16, innerTopY + 10)}
                    width={72}
                    height={26}
                    rx={13}
                    fill={colors.surface}
                    stroke={colors.primary}
                    strokeWidth={1.5}
                    opacity={0.96}
                  />
                  <SvgText
                    x={centerX}
                    y={Math.max(waterSurfaceY + 2, innerTopY + 28)}
                    fontSize={12}
                    fontFamily={Typography.fontFamily.bold}
                    fill={colors.primary}
                    textAnchor="middle"
                  >
                    {percentNumber}%
                  </SvgText>
                </G>
              )}
            </Svg>
          </Animated.View>
          <Text style={[styles.tapHintText, { color: colors.primary }]}>Tap glass for wave shake 🥛</Text>
        </TouchableOpacity>
      )}

      {/* Mode 2: Multi-Glass Daily Grid */}
      {viewMode === 'multi' && (
        <View style={styles.multiGlassContainer}>
          <View style={styles.multiHeaderRow}>
            <Text style={[styles.multiTitle, { color: colors.textPrimary }]}>
              {fullGlassesCount} of {totalGlasses} Glasses Drank 💧
            </Text>
            <Text style={[styles.multiSub, { color: colors.textTertiary }]}>
              {GLASS_SIZE_ML}ml / glass
            </Text>
          </View>

          <View style={styles.glassesGrid}>
            {Array.from({ length: totalGlasses }).map((_, index) => {
              const isFull = index < fullGlassesCount;
              const isPartial = index === fullGlassesCount && partialGlassFill > 0;
              const isNext = index === fullGlassesCount && partialGlassFill === 0;
              const fillPct = isFull ? 1 : isPartial ? partialGlassFill : 0;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.glassCard,
                    {
                      backgroundColor: isFull
                        ? colors.surfaceBlue
                        : isDark
                        ? '#1E293B'
                        : '#F1F5F9',
                      borderColor: isFull
                        ? colors.primary
                        : isNext
                        ? '#38BDF8'
                        : colors.border,
                      borderWidth: isFull || isNext ? 1.5 : 1,
                    },
                  ]}
                  onPress={() => onQuickAdd && onQuickAdd(GLASS_SIZE_ML)}
                  activeOpacity={0.8}
                >
                  {/* Glass Cup Graphic */}
                  <View style={styles.glassCupIconWrap}>
                    <Svg width={36} height={46} viewBox="0 0 36 46">
                      <Defs>
                        <LinearGradient id={`cupGrad_${index}`} x1="0" y1="0" x2="0" y2="1">
                          <Stop offset="0%" stopColor="#38BDF8" />
                          <Stop offset="100%" stopColor="#0284C7" />
                        </LinearGradient>
                        <ClipPath id={`cupClip_${index}`}>
                          <Path d="M 4 4 L 32 4 L 28 42 Q 18 45 8 42 Z" />
                        </ClipPath>
                      </Defs>

                      {/* Glass Body */}
                      <Path
                        d="M 4 4 L 32 4 L 28 42 Q 18 45 8 42 Z"
                        fill={isDark ? '#0F172A' : '#E2E8F0'}
                        stroke={isFull ? '#0284C7' : '#94A3B8'}
                        strokeWidth={1.5}
                      />

                      {/* Water Fill with wave curve */}
                      {fillPct > 0 && (
                        <G clipPath={`url(#cupClip_${index})`}>
                          <Rect
                            x={0}
                            y={42 - 38 * fillPct}
                            width={36}
                            height={42}
                            fill={`url(#cupGrad_${index})`}
                          />
                          <Path
                            d={`M 4 ${42 - 38 * fillPct} Q 18 ${42 - 38 * fillPct + 3} 32 ${42 - 38 * fillPct} L 32 42 L 4 42 Z`}
                            fill="#38BDF8"
                            opacity={0.8}
                          />
                        </G>
                      )}

                      {/* Glass Highlight */}
                      <Line
                        x1={7}
                        y1={6}
                        x2={10}
                        y2={38}
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        opacity={0.7}
                      />
                    </Svg>

                    {/* Status Badge */}
                    {isFull ? (
                      <View style={[styles.glassBadge, { backgroundColor: '#10B981' }]}>
                        <Feather name="check" size={10} color="#FFFFFF" />
                      </View>
                    ) : isNext ? (
                      <View style={[styles.glassBadge, { backgroundColor: colors.primary }]}>
                        <Feather name="plus" size={10} color="#FFFFFF" />
                      </View>
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.glassNumberText,
                      { color: isFull ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    Glass {index + 1}
                  </Text>
                  <Text style={[styles.glassVolText, { color: colors.textTertiary }]}>
                    {isFull
                      ? `${GLASS_SIZE_ML}ml`
                      : isPartial
                      ? `${Math.round(GLASS_SIZE_ML * partialGlassFill)}ml`
                      : `${GLASS_SIZE_ML}ml`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Readout Summary */}
      <View style={styles.readoutCard}>
        <View style={styles.readoutRow}>
          <Text style={styles.readoutValue}>{formatWater(consumed)}</Text>
          <Text style={styles.readoutGoal}>/ {formatWater(goal)}</Text>
        </View>
        <Text style={styles.readoutSub}>
          {consumed >= goal
            ? '🎉 Daily goal achieved! Keep hydrated!'
            : `${formatWater(Math.max(goal - consumed, 0))} remaining (${percentNumber}%)`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },

  // Toggle buttons
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    padding: 3,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  toggleBtnActive: {
    ...Shadows.sm,
  },
  toggleBtnText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.xs,
  },

  singleTouchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  singleViewWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHintText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
    marginTop: Spacing.xs,
    textAlign: 'center',
    opacity: 0.85,
  },

  // Multi-Glass Grid
  multiGlassContainer: {
    width: '100%',
    paddingHorizontal: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  multiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  multiTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.sm,
  },
  multiSub: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
  },
  glassesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  glassCard: {
    width: '22%',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 4,
    alignItems: 'center',
    ...Shadows.sm,
  },
  glassCupIconWrap: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 4,
  },
  glassBadge: {
    position: 'absolute',
    bottom: -2,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  glassNumberText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 10,
    marginTop: 2,
  },
  glassVolText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 9,
    marginTop: 1,
  },

  // Readout
  readoutCard: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  readoutRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  readoutValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xxl,
    color: '#0284C7',
  },
  readoutGoal: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.md,
    color: '#94A3B8',
  },
  readoutSub: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
    color: '#64748B',
    marginTop: 2,
  },
});
