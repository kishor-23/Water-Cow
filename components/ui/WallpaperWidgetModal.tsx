/**
 * WallpaperWidgetModal — Generates and exports custom aesthetic phone wallpapers
 * and home/lockscreen widgets for tracking total liters of water consumed today.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { FeatherIcon } from './FeatherIcon';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { CowMascot } from '../cow/CowMascot';
import { formatWater, formatLiters } from '../../utils/hydration';
import type { CowMood } from '../../constants/cowMoods';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WallpaperWidgetModalProps {
  visible: boolean;
  onClose: () => void;
  consumed: number;
  goal: number;
  cowMood: CowMood;
  userName: string;
}

interface WallpaperTheme {
  id: string;
  name: string;
  bgGradient: [string, string];
  accentColor: string;
  textColor: string;
  subTextColor: string;
  cardBg: string;
  isDark: boolean;
}

const THEMES: WallpaperTheme[] = [
  {
    id: 'ocean',
    name: 'Ocean Blue',
    bgGradient: ['#0C4A6E', '#0284C7'],
    accentColor: '#38BDF8',
    textColor: '#FFFFFF',
    subTextColor: '#BAE6FD',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    isDark: true,
  },
  {
    id: 'midnight',
    name: 'OLED Night',
    bgGradient: ['#090D16', '#1E293B'],
    accentColor: '#38BDF8',
    textColor: '#FFFFFF',
    subTextColor: '#94A3B8',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    isDark: true,
  },
  {
    id: 'emerald',
    name: 'Fresh Mint',
    bgGradient: ['#064E3B', '#059669'],
    accentColor: '#34D399',
    textColor: '#FFFFFF',
    subTextColor: '#A7F3D0',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    isDark: true,
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    bgGradient: ['#4C1D95', '#D97706'],
    accentColor: '#FBBF24',
    textColor: '#FFFFFF',
    subTextColor: '#FDE68A',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    isDark: true,
  },
  {
    id: 'pastel',
    name: 'Pastel Cow',
    bgGradient: ['#FDF2F8', '#E0F2FE'],
    accentColor: '#0284C7',
    textColor: '#0F172A',
    subTextColor: '#475569',
    cardBg: '#FFFFFF',
    isDark: false,
  },
];

export function WallpaperWidgetModal({
  visible,
  onClose,
  consumed,
  goal,
  cowMood,
  userName,
}: WallpaperWidgetModalProps) {
  const { colors } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<WallpaperTheme>(THEMES[0]);
  const [isExporting, setIsExporting] = useState(false);

  const progress = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const percentText = `${Math.round(progress * 100)}%`;
  const litersConsumed = (consumed / 1000).toFixed(1);
  const litersGoal = (goal / 1000).toFixed(1);
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleExportWallpaper = async () => {
    setIsExporting(true);
    try {
      const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${selectedTheme.bgGradient[0]}" />
      <stop offset="100%" stop-color="${selectedTheme.bgGradient[1]}" />
    </linearGradient>
    <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${selectedTheme.accentColor}" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bg)" />

  <!-- Top Ambient Droplet Circles -->
  <circle cx="900" cy="200" r="180" fill="${selectedTheme.accentColor}" opacity="0.08" />
  <circle cx="150" cy="450" r="120" fill="${selectedTheme.accentColor}" opacity="0.06" />
  <circle cx="850" cy="1600" r="220" fill="${selectedTheme.accentColor}" opacity="0.08" />

  <!-- Header Date & Greeting -->
  <text x="540" y="320" font-family="-apple-system, Roboto, sans-serif" font-size="32" font-weight="600" fill="${selectedTheme.subTextColor}" text-anchor="middle" letter-spacing="2">
    ${dateStr.toUpperCase()}
  </text>
  <text x="540" y="390" font-family="-apple-system, Roboto, sans-serif" font-size="54" font-weight="800" fill="${selectedTheme.textColor}" text-anchor="middle">
    ${userName}'s Daily Hydration
  </text>

  <!-- Main Widget Card -->
  <rect x="100" y="470" width="880" height="980" rx="48" fill="${selectedTheme.cardBg}" filter="url(#shadow)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />

  <!-- Water Liter Big Stat -->
  <text x="540" y="600" font-family="-apple-system, Roboto, sans-serif" font-size="110" font-weight="900" fill="${selectedTheme.accentColor}" text-anchor="middle">
    ${litersConsumed} L
  </text>
  <text x="540" y="660" font-family="-apple-system, Roboto, sans-serif" font-size="32" font-weight="600" fill="${selectedTheme.subTextColor}" text-anchor="middle">
    Consumed of ${litersGoal} L Goal (${percentText})
  </text>

  <!-- Progress Bar Track -->
  <rect x="180" y="720" width="720" height="32" rx="16" fill="rgba(0,0,0,0.15)" />
  <!-- Progress Bar Fill -->
  <rect x="180" y="720" width="${Math.max(32, 720 * progress)}" height="32" rx="16" fill="url(#barGrad)" />

  <!-- Cow Mascot Area Placeholder / Visual (Circle Backing) -->
  <circle cx="540" cy="980" r="170" fill="rgba(255,255,255,0.12)" />
  <text x="540" y="990" font-family="-apple-system, Roboto, sans-serif" font-size="130" text-anchor="middle">
    🐄
  </text>

  <!-- Motivational Tagline -->
  <text x="540" y="1280" font-family="-apple-system, Roboto, sans-serif" font-size="36" font-weight="700" fill="${selectedTheme.textColor}" text-anchor="middle">
    ${progress >= 1 ? '🎉 Daily Goal Complete! Moo-velous!' : '💧 Keep going! Every sip counts.'}
  </text>
  <text x="540" y="1340" font-family="-apple-system, Roboto, sans-serif" font-size="26" font-weight="500" fill="${selectedTheme.subTextColor}" text-anchor="middle">
    Water Cow • Live Hydration Tracker
  </text>

  <!-- Footer Branding -->
  <text x="540" y="1780" font-family="-apple-system, Roboto, sans-serif" font-size="28" font-weight="600" fill="${selectedTheme.subTextColor}" text-anchor="middle" opacity="0.8">
    Water Cow 🐄💧
  </text>
</svg>
      `.trim();

      const fileName = `WaterCow_Wallpaper_${selectedTheme.id}_${Date.now()}.svg`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, svgContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'image/svg+xml',
          dialogTitle: 'Save or Set Water Cow Wallpaper',
          UTI: 'public.svg-image',
        });
      } else {
        Alert.alert('Saved', `Wallpaper exported to ${filePath}`);
      }
    } catch (err) {
      console.error('Error exporting wallpaper:', err);
      Alert.alert('Export Error', 'Could not export wallpaper graphic.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Wallpaper Widget 📱
              </Text>
              <Text style={[styles.modalSub, { color: colors.textTertiary }]}>
                Live daily water liters track for your phone wallpaper
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FeatherIcon name="x" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
            {/* Wallpaper Preview Card */}
            <View
              style={[
                styles.wallpaperPreview,
                {
                  backgroundColor: selectedTheme.bgGradient[0],
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Date Header */}
              <Text style={[styles.previewDate, { color: selectedTheme.subTextColor }]}>
                {dateStr.toUpperCase()}
              </Text>
              <Text style={[styles.previewGreeting, { color: selectedTheme.textColor }]}>
                {userName}'s Hydration
              </Text>

              {/* Main Widget Box */}
              <View style={[styles.widgetBox, { backgroundColor: selectedTheme.cardBg }]}>
                {/* Liters Track */}
                <View style={styles.litersRow}>
                  <Text style={[styles.litersNumber, { color: selectedTheme.accentColor }]}>
                    {litersConsumed} L
                  </Text>
                  <View style={[styles.percentBadge, { backgroundColor: selectedTheme.accentColor }]}>
                    <Text style={styles.percentBadgeText}>{percentText}</Text>
                  </View>
                </View>
                <Text style={[styles.litersSub, { color: selectedTheme.subTextColor }]}>
                  Consumed of {litersGoal} L Daily Goal
                </Text>

                {/* Progress Bar */}
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.max(6, Math.min(progress * 100, 100))}%`,
                        backgroundColor: selectedTheme.accentColor,
                      },
                    ]}
                  />
                </View>

                {/* Cow Mascot */}
                <View style={styles.cowWrap}>
                  <CowMascot mood={cowMood} size={110} />
                </View>

                <Text style={[styles.quoteText, { color: selectedTheme.textColor }]}>
                  {progress >= 1
                    ? '🎉 Goal Reached! Moo-velous!'
                    : '💧 Keep going! Stay hydrated!'}
                </Text>
              </View>

              <Text style={[styles.brandText, { color: selectedTheme.subTextColor }]}>
                Water Cow 🐄💧
              </Text>
            </View>

            {/* Theme Selector */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Choose Theme</Text>
            <View style={styles.themesRow}>
              {THEMES.map((theme) => {
                const isSelected = selectedTheme.id === theme.id;
                return (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.themePill,
                      { backgroundColor: theme.bgGradient[0] },
                      isSelected && styles.themePillActive,
                    ]}
                    onPress={() => setSelectedTheme(theme)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.themePillText,
                        { color: theme.textColor },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {theme.name}
                    </Text>
                    {isSelected && (
                      <FeatherIcon name="check-circle" size={14} color={theme.accentColor} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[
                styles.exportButton,
                { backgroundColor: colors.primary, opacity: isExporting ? 0.7 : 1 },
              ]}
              onPress={handleExportWallpaper}
              disabled={isExporting}
              activeOpacity={0.85}
            >
              <FeatherIcon name="download" size={20} color={colors.textOnPrimary} />
              <Text style={[styles.exportBtnText, { color: colors.textOnPrimary }]}>
                {isExporting ? 'Generating Wallpaper...' : 'Export & Save Wallpaper'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xl,
  },
  modalSub: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  modalScroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },

  // Wallpaper Preview Card
  wallpaperPreview: {
    borderRadius: 24,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  previewDate: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  previewGreeting: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
    marginBottom: Spacing.md,
  },
  widgetBox: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  litersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  litersNumber: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 38,
    lineHeight: 44,
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  percentBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xs,
    color: '#0F172A',
  },
  litersSub: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  barTrack: {
    width: '90%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.15)',
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  cowWrap: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  quoteText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  brandText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 10,
    marginTop: Spacing.md,
    opacity: 0.8,
  },

  // Themes
  sectionTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    marginBottom: Spacing.sm,
  },
  themesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  themePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  themePillActive: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Shadows.sm,
  },
  themePillText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
  },

  // Export Button
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  exportBtnText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
  },
});
