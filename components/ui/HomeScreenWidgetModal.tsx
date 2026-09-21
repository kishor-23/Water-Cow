/**
 * HomeScreenWidgetModal — Previews and guides users on using the Android Home Screen Widget
 * to track total liters of water consumed today right on their phone's home screen.
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
  Platform,
} from 'react-native';
import { FeatherIcon } from './FeatherIcon';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { updateNativeWidget } from '../../utils/widget';
import { formatWater } from '../../utils/hydration';

interface HomeScreenWidgetModalProps {
  visible: boolean;
  onClose: () => void;
  consumed: number;
  goal: number;
}

export function HomeScreenWidgetModal({
  visible,
  onClose,
  consumed,
  goal,
}: HomeScreenWidgetModalProps) {
  const { colors } = useTheme();
  const progress = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const percentText = `${Math.round(progress * 100)}%`;
  const litersConsumed = (consumed / 1000).toFixed(1);
  const litersGoal = (goal / 1000).toFixed(1);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Home Screen Widget 📱
              </Text>
              <Text style={[styles.modalSub, { color: colors.textTertiary }]}>
                Track live liters consumed today on your phone screen
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FeatherIcon name="x" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
            {/* Live Widget Preview Card */}
            <Text style={[styles.previewLabel, { color: colors.textTertiary }]}>WIDGET PREVIEW</Text>
            <View style={styles.widgetCard}>
              {/* Top Row */}
              <View style={styles.widgetHeader}>
                <Text style={styles.widgetTitle}>Water Cow 🐄</Text>
                <Text style={styles.widgetDate}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
              </View>

              {/* Center Content */}
              <View style={styles.widgetCenter}>
                <View style={styles.widgetLitersWrap}>
                  <Text style={styles.widgetLitersText}>{litersConsumed} L</Text>
                  <Text style={styles.widgetGoalText}>
                    of {litersGoal} L Goal ({percentText})
                  </Text>
                </View>

                {/* Quick Add Pill */}
                <View style={styles.widgetQuickBtn}>
                  <Text style={styles.widgetQuickBtnText}>💧 +250ml</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.widgetProgressBar}>
                <View
                  style={[
                    styles.widgetProgressFill,
                    { width: `${Math.max(6, Math.min(progress * 100, 100))}%` },
                  ]}
                />
              </View>
            </View>

            {/* How to add to home screen */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              How to add to your Home Screen
            </Text>

            <View style={styles.stepsContainer}>
              <View style={[styles.stepItem, { backgroundColor: colors.surfaceBlue }]}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  Go to your Android phone's <Text style={{ fontWeight: 'bold' }}>Home Screen</Text>.
                </Text>
              </View>

              <View style={[styles.stepItem, { backgroundColor: colors.surfaceBlue }]}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  <Text style={{ fontWeight: 'bold' }}>Long-press</Text> on any empty area of the screen.
                </Text>
              </View>

              <View style={[styles.stepItem, { backgroundColor: colors.surfaceBlue }]}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  Tap <Text style={{ fontWeight: 'bold' }}>Widgets</Text> in the menu.
                </Text>
              </View>

              <View style={[styles.stepItem, { backgroundColor: colors.surfaceBlue }]}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  Select <Text style={{ fontWeight: 'bold' }}>Water Cow</Text> and drag it onto your screen!
                </Text>
              </View>
            </View>

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

  previewLabel: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },

  // Realistic Widget Preview Box
  widgetCard: {
    backgroundColor: '#0C4A6E',
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.sm,
    color: '#FFFFFF',
  },
  widgetDate: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 11,
    color: '#BAE6FD',
  },
  widgetCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  widgetLitersWrap: {
    flex: 1,
  },
  widgetLitersText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 32,
    color: '#38BDF8',
    lineHeight: 38,
  },
  widgetGoalText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 12,
    color: '#E0F2FE',
  },
  widgetQuickBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  widgetQuickBtnText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  widgetProgressBar: {
    height: 8,
    backgroundColor: '#082F49',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  widgetProgressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },

  // Steps
  sectionTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    marginBottom: Spacing.md,
  },
  stepsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xs,
    color: '#FFFFFF',
  },
  stepText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    flex: 1,
  },
});
