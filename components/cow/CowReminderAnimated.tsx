/**
 * CowReminderAnimated — Specialized, interactive animated cow mascot for the Reminders screen.
 * Features animated bell-ringing with soundwaves, ear wiggling, eye blinking,
 * switchable poses (Bell Alarm, Water Sipping, Cheering, Sleeping), and tap reactions.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Svg, {
  G,
  Circle,
  Ellipse,
  Path,
  Rect,
  Line,
} from 'react-native-svg';
import { FeatherIcon } from '../ui/FeatherIcon';
import { createAudioPlayer } from 'expo-audio';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export type ReminderCowPose = 'bell' | 'sipping' | 'cheering' | 'sleeping';

interface CowReminderAnimatedProps {
  enabled?: boolean;
  intervalMinutes?: number;
  onSoundTriggered?: () => void;
  initialPose?: ReminderCowPose;
  hidePoseSelector?: boolean;
  hideTapHint?: boolean;
  size?: number;
  enableSoundOnTap?: boolean;
  enableSpeechBubble?: boolean;
  shortSpeech?: boolean;
  customQuotes?: string[];
}

export function CowReminderAnimated({
  enabled = true,
  intervalMinutes = 45,
  onSoundTriggered,
  initialPose = 'bell',
  hidePoseSelector = false,
  hideTapHint = false,
  size = 180,
  enableSoundOnTap = false,
  enableSpeechBubble = false,
  shortSpeech = false,
  customQuotes,
}: CowReminderAnimatedProps) {
  const { colors, isDark } = useTheme();

  // Active animation pose
  const [pose, setPose] = useState<ReminderCowPose>(initialPose);
  const [speechText, setSpeechText] = useState<string>('');
  const [showSpeech, setShowSpeech] = useState(false);

  useEffect(() => {
    setPose(initialPose);
  }, [initialPose]);

  // Animated values
  const idleBob = useRef(new Animated.Value(0)).current;
  const bellSwing = useRef(new Animated.Value(0)).current;
  const earWiggle = useRef(new Animated.Value(0)).current;
  const tapBounce = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const soundWavePulse = useRef(new Animated.Value(0)).current;
  const strawSipAnim = useRef(new Animated.Value(0)).current;

  // 1. Idle vertical bobbing & Head sway
  useEffect(() => {
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleBob, {
          toValue: -6,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(idleBob, {
          toValue: 4,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop.start();
    return () => bobLoop.stop();
  }, []);

  // 2. Bell Ringing Animation (Active when pose is 'bell')
  useEffect(() => {
    const bellLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bellSwing, {
          toValue: 1,
          duration: 250,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bellSwing, {
          toValue: -1,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bellSwing, {
          toValue: 0,
          duration: 250,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ])
    );

    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(soundWavePulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(soundWavePulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1100),
      ])
    );

    bellLoop.start();
    waveLoop.start();

    return () => {
      bellLoop.stop();
      waveLoop.stop();
    };
  }, []);

  // 3. Ear Wiggling Animation
  useEffect(() => {
    const earLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(earWiggle, {
          toValue: 1,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(earWiggle, {
          toValue: -1,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(earWiggle, {
          toValue: 0,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    earLoop.start();
    return () => earLoop.stop();
  }, []);

  // 4. Eye Blinking Loop
  useEffect(() => {
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(3500),
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ])
    );
    blinkLoop.start();
    return () => blinkLoop.stop();
  }, []);

  // 5. Water sipping straw pulse
  useEffect(() => {
    const sipLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(strawSipAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(strawSipAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    sipLoop.start();
    return () => sipLoop.stop();
  }, []);

  // Interactive Tap Action
  const handleCowTap = async () => {
    // 1. Play cute bounce spring
    Animated.sequence([
      Animated.timing(tapBounce, {
        toValue: 0.88,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(tapBounce, {
        toValue: 1.12,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.spring(tapBounce, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Play cute sound (random moo or bell sound on tap)
    if (enableSoundOnTap) {
      try {
        const isBell = Math.random() < 0.5;
        const soundFile = isBell
          ? require('../../assets/sounds/cow_bell.mp3')
          : require('../../assets/sounds/cow_moo.mp3');
        const player = createAudioPlayer(soundFile);
        player.play();
        if (onSoundTriggered) onSoundTriggered();
      } catch (e) {
        console.warn('Audio play error:', e);
      }
    }

    // 3. Speech quotes (speech bubble on tap)
    if (enableSpeechBubble) {
      const defaultShortQuotes = [
        "Oii! 🐮",
        "Howdy! 🤠",
        "Hi! 👋",
        "Moo! 🥛",
        "Sip! 💧",
        "Yo! ✨",
      ];
      const defaultLongQuotes = [
        "Oii! 🐮",
        "Howdy! 🤠",
        "Hi! 👋",
        "Moo! 🥛",
        "Sip! 💧",
      ];
      const quotes = customQuotes && customQuotes.length > 0
        ? customQuotes
        : shortSpeech
          ? defaultShortQuotes
          : defaultLongQuotes;

      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      setSpeechText(quote);
      setShowSpeech(true);
      setTimeout(() => setShowSpeech(false), shortSpeech ? 2500 : 3500);
    }
  };

  // Interpolations
  const bellRotateStr = bellSwing.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-22deg', '0deg', '22deg'],
  });

  const earRotateLeftStr = earWiggle.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '15deg'],
  });

  const earRotateRightStr = earWiggle.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['15deg', '0deg', '-12deg'],
  });

  const svgWidth = size;
  const svgHeight = Math.round((size * 170) / 180);

  return (
    <View style={styles.container}>
      {/* Pose Selector Pills */}
      {!hidePoseSelector && (
        <View style={[styles.poseSelector, { backgroundColor: colors.surfaceBlue }]}>
          <TouchableOpacity
            style={[styles.poseBtn, pose === 'bell' && [styles.poseBtnActive, { backgroundColor: colors.primary }]]}
            onPress={() => setPose('bell')}
            activeOpacity={0.8}
          >
            <Text style={[styles.poseBtnText, { color: pose === 'bell' ? colors.textOnPrimary : colors.textSecondary }]}>
              🔔 Bell Alarm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.poseBtn, pose === 'sipping' && [styles.poseBtnActive, { backgroundColor: colors.primary }]]}
            onPress={() => setPose('sipping')}
            activeOpacity={0.8}
          >
            <Text style={[styles.poseBtnText, { color: pose === 'sipping' ? colors.textOnPrimary : colors.textSecondary }]}>
              🥛 Sipping
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.poseBtn, pose === 'cheering' && [styles.poseBtnActive, { backgroundColor: colors.primary }]]}
            onPress={() => setPose('cheering')}
            activeOpacity={0.8}
          >
            <Text style={[styles.poseBtnText, { color: pose === 'cheering' ? colors.textOnPrimary : colors.textSecondary }]}>
              🎉 Cheering
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Animated Speech Bubble */}
      {enableSpeechBubble && showSpeech && (
        <View style={[styles.speechBubble, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
          <Text style={[styles.speechText, { color: colors.textPrimary }]}>{speechText}</Text>
          <View style={[styles.speechTail, { borderTopColor: colors.primary }]} />
        </View>
      )}

      {/* Main Interactive Cow Avatar */}
      <TouchableOpacity onPress={handleCowTap} activeOpacity={0.9} style={styles.avatarTouchable}>
        <Animated.View
          style={[
            styles.cowWrapper,
            {
              transform: [
                { translateY: idleBob },
                { scale: tapBounce },
              ],
            },
          ]}
        >
          <Svg width={svgWidth} height={svgHeight} viewBox="0 0 180 170">
            {/* Ground Shadow */}
            <Ellipse cx={90} cy={155} rx={50} ry={12} fill="rgba(0,0,0,0.12)" />

            <G transform="translate(90, 85)">
              {/* Cow Body */}
              <Ellipse cx={0} cy={22} rx={42} ry={35} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1.5} />
              {/* Body Spots */}
              <Ellipse cx={-15} cy={16} rx={11} ry={9} fill="#334155" opacity={0.85} />
              <Ellipse cx={18} cy={30} rx={9} ry={7} fill="#334155" opacity={0.85} />

              {/* Head */}
              <Ellipse cx={0} cy={-16} rx={34} ry={30} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1.5} />
              {/* Head Spot */}
              <Ellipse cx={14} cy={-28} rx={15} ry={11} fill="#334155" opacity={0.85} />

              {/* Ears */}
              <Ellipse cx={-34} cy={-28} rx={14} ry={8} fill="#334155" transform="rotate(-25 -34 -28)" />
              <Ellipse cx={-32} cy={-28} rx={9} ry={5} fill="#FDA4AF" transform="rotate(-25 -32 -28)" />
              <Ellipse cx={34} cy={-28} rx={14} ry={8} fill="#334155" transform="rotate(25 34 -28)" />
              <Ellipse cx={32} cy={-28} rx={9} ry={5} fill="#FDA4AF" transform="rotate(25 32 -28)" />

              {/* Horns */}
              <Path d="M -20 -42 Q -22 -56 -16 -54" stroke="#FBBF24" strokeWidth={4} fill="none" strokeLinecap="round" />
              <Path d="M 20 -42 Q 22 -56 16 -54" stroke="#FBBF24" strokeWidth={4} fill="none" strokeLinecap="round" />

              {/* Snout */}
              <Ellipse cx={0} cy={-2} rx={18} ry={12} fill="#FECDD3" stroke="#FDA4AF" strokeWidth={1} />
              {/* Nostrils */}
              <Ellipse cx={-6} cy={-1} rx={2.5} ry={2} fill="#E11D48" opacity={0.6} />
              <Ellipse cx={6} cy={-1} rx={2.5} ry={2} fill="#E11D48" opacity={0.6} />

              {/* Cheeks Blush */}
              <Ellipse cx={-24} cy={-6} rx={7} ry={4.5} fill="#FDA4AF" opacity={0.5} />
              <Ellipse cx={24} cy={-6} rx={7} ry={4.5} fill="#FDA4AF" opacity={0.5} />

              {/* Eyes with Blinking */}
              {pose === 'sleeping' ? (
                <>
                  <Path d="M -16 -16 Q -12 -12 -8 -16" stroke="#1E293B" strokeWidth={2.5} fill="none" strokeLinecap="round" />
                  <Path d="M 8 -16 Q 12 -12 16 -16" stroke="#1E293B" strokeWidth={2.5} fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <Circle cx={-12} cy={-18} r={3.8} fill="#1E293B" />
                  <Circle cx={-13.5} cy={-19.5} r={1.3} fill="#FFFFFF" />
                  <Circle cx={12} cy={-18} r={3.8} fill="#1E293B" />
                  <Circle cx={10.5} cy={-19.5} r={1.3} fill="#FFFFFF" />
                </>
              )}

              {/* Mouth & Expression */}
              {pose === 'sipping' ? (
                <Circle cx={0} cy={5} r={3} fill="#E11D48" opacity={0.7} />
              ) : (
                <Path d="M -6 4 Q 0 8 6 4" stroke="#E11D48" strokeWidth={2} fill="none" strokeLinecap="round" />
              )}

              {/* POSE SPECIFIC ACCESSORIES */}

              {/* 1. BELL ALARM POSE: Animated Golden Bell with Sound Waves */}
              {pose === 'bell' && (
                <G transform="translate(0, 16)">
                  {/* Bell Strap */}
                  <Line x1={0} y1={-8} x2={0} y2={-2} stroke="#B45309" strokeWidth={2} />
                  {/* Bell Body */}
                  <Path d="M -7 4 Q -9 12 -12 14 L 12 14 Q 9 12 7 4 Z" fill="#F59E0B" stroke="#D97706" strokeWidth={1} />
                  <Circle cx={0} cy={16} r={2.5} fill="#B45309" />

                  {/* Sound Wave Rings */}
                  <Path d="M -16 6 Q -22 10 -16 16" stroke="#38BDF8" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />
                  <Path d="M 16 6 Q 22 10 16 16" stroke="#38BDF8" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />
                  <Path d="M -20 2 Q -28 10 -20 20" stroke="#0284C7" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.5} />
                  <Path d="M 20 2 Q 28 10 20 20" stroke="#0284C7" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.5} />
                </G>
              )}

              {/* 2. SIPPING POSE: Water Glass with Straw */}
              {pose === 'sipping' && (
                <G transform="translate(0, 12)">
                  {/* Glass */}
                  <Path d="M -10 6 L 10 6 L 8 26 Q 0 28 -8 26 Z" fill="rgba(224, 242, 254, 0.7)" stroke="#0284C7" strokeWidth={1.5} />
                  {/* Water in glass */}
                  <Path d="M -9 12 L 9 12 L 7 25 Q 0 27 -7 25 Z" fill="#38BDF8" opacity={0.85} />
                  {/* Drinking Straw */}
                  <Path d="M 0 -6 L 2 10 L 4 24" stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round" />
                  {/* Ambient Drink Droplets */}
                  <Circle cx={-14} cy={0} r={2} fill="#38BDF8" opacity={0.7} />
                  <Circle cx={16} cy={-4} r={2.5} fill="#38BDF8" opacity={0.7} />
                </G>
              )}

              {/* 3. CHEERING POSE: Raised Paws & Sparkles */}
              {pose === 'cheering' && (
                <G>
                  {/* Left Waving Paw */}
                  <Ellipse cx={-38} cy={-2} rx={8} ry={12} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1.5} transform="rotate(-35 -38 -2)" />
                  {/* Right Waving Paw */}
                  <Ellipse cx={38} cy={-2} rx={8} ry={12} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1.5} transform="rotate(35 38 -2)" />
                  {/* Sparkles */}
                  <Path d="M -30 -38 L -28 -34 L -26 -38 L -28 -42 Z" fill="#F59E0B" />
                  <Path d="M 30 -38 L 32 -34 L 34 -38 L 32 -42 Z" fill="#F59E0B" />
                  <Circle cx={-38} cy={-24} r={2} fill="#38BDF8" />
                  <Circle cx={38} cy={-24} r={2} fill="#38BDF8" />
                </G>
              )}
            </G>
          </Svg>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },

  // Pose Selector
  poseSelector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    padding: 3,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  poseBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  poseBtnActive: {
    ...Shadows.sm,
  },
  poseBtnText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.xs,
  },

  // Speech Bubble
  speechBubble: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    marginBottom: 4,
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: 130,
    position: 'relative',
    ...Shadows.sm,
  },
  speechText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
    textAlign: 'center',
  },
  speechTail: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },

  avatarTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 11,
    marginTop: 2,
  },
});
