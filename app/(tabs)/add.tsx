/**
 * Add Water Screen — Log water intake with quick amounts and custom option.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { CowReminderAnimated } from '../../components/cow/CowReminderAnimated';
import { PillButton } from '../../components/ui/PillButton';
import { Card } from '../../components/ui/Card';
import { useHydration } from '../../context/HydrationContext';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { formatWater } from '../../utils/hydration';

const QUICK_AMOUNTS = [100, 200, 250, 300, 500];

export default function AddWaterScreen() {
  const { addWater, cowMood, state, hideSuccess } = useHydration();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [selectedAmount, setSelectedAmount] = useState(250);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [showDrinkingAnimation, setShowDrinkingAnimation] = useState(false);

  // Success animation values
  const successScale = useSharedValue(0);
  const successOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Show success feedback
  useEffect(() => {
    if (state.showSuccess) {
      setShowDrinkingAnimation(true);

      successScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, { damping: 8, stiffness: 150 }),
        withDelay(1500, withTiming(0, { duration: 300 }))
      );
      successOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(1500, withTiming(0, { duration: 300 }))
      );

      const timer = setTimeout(() => {
        setShowDrinkingAnimation(false);
        hideSuccess();
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [state.showSuccess]);

  const handleAddWater = () => {
    const amount = isCustom ? parseInt(customValue) || 0 : selectedAmount;
    if (amount <= 0) return;

    // Button press animation
    buttonScale.value = withSequence(
      withTiming(0.92, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    addWater(amount);
  };

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
  };

  const handleCustom = () => {
    setIsCustom(true);
    setCustomValue('');
  };

  const displayAmount = isCustom ? (parseInt(customValue) || 0) : selectedAmount;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Text style={styles.title}>How much did you drink?</Text>

          {/* Cow Illustration */}
          <View style={styles.cowSection}>
            <CowReminderAnimated
              initialPose={showDrinkingAnimation ? 'cheering' : 'sipping'}
              hidePoseSelector={true}
              hideTapHint={true}
              size={130}
            />
          </View>

          {/* Success Feedback */}
          {state.showSuccess && (
            <Animated.View style={[styles.successBadge, successAnimatedStyle]}>
              <Text style={styles.successText}>
                +{formatWater(displayAmount)} added! 💧
              </Text>
            </Animated.View>
          )}

          {/* Amount Display */}
          <View style={styles.amountDisplay}>
            <Text style={styles.amountValue}>{displayAmount}</Text>
            <Text style={styles.amountUnit}>ml</Text>
          </View>

          {/* Quick Amounts */}
          <Card style={styles.amountsCard}>
            <Text style={styles.sectionLabel}>Quick amounts</Text>
            <View style={styles.pillGrid}>
              {QUICK_AMOUNTS.map((amount) => (
                <PillButton
                  key={amount}
                  label={`${amount} ml`}
                  selected={!isCustom && selectedAmount === amount}
                  onPress={() => handleSelectAmount(amount)}
                  size="md"
                />
              ))}
              <PillButton
                label="Custom"
                selected={isCustom}
                onPress={handleCustom}
                size="md"
              />
            </View>

            {/* Custom Input */}
            {isCustom && (
              <View style={styles.customInputRow}>
                <TextInput
                  style={styles.customInput}
                  value={customValue}
                  onChangeText={setCustomValue}
                  placeholder="Enter amount"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="number-pad"
                  cursorColor={colors.primary}
                  selectionColor={colors.primary}
                  autoFocus
                  maxLength={4}
                  returnKeyType="done"
                  onSubmitEditing={handleAddWater}
                />
                <Text style={styles.customUnit}>ml</Text>
              </View>
            )}
          </Card>

          {/* Add Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={[
                styles.addButton,
                displayAmount <= 0 && styles.addButtonDisabled,
              ]}
              onPress={handleAddWater}
              activeOpacity={0.85}
              disabled={displayAmount <= 0}
            >
              <Text style={styles.addButtonText}>
                Add {formatWater(displayAmount)}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Today's total */}
          <View style={styles.todayTotal}>
            <Text style={styles.todayLabel}>Today's total</Text>
            <Text style={styles.todayValue}>
              {formatWater(state.totalConsumed)} / {formatWater(state.profile.dailyGoal)}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },

  // Header
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xxl,
    color: colors.textPrimary,
    textAlign: 'center',
    paddingTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },

  // Cow
  cowSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  // Success
  successBadge: {
    alignSelf: 'center',
    backgroundColor: colors.successLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  successText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    color: colors.success,
  },

  // Amount Display
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  amountValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 56,
    color: colors.primary,
  },
  amountUnit: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xl,
    color: colors.textTertiary,
    marginLeft: Spacing.xs,
  },

  // Amounts Card
  amountsCard: {
    marginBottom: Spacing.xxl,
  },
  sectionLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
    marginBottom: Spacing.md,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  // Custom Input
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: Spacing.lg,
  },
  customInput: {
    flex: 1,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.xl,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceBlue,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  customUnit: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.lg,
    color: colors.textTertiary,
    marginLeft: Spacing.md,
  },

  // Add Button
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg + 2,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  addButtonDisabled: {
    backgroundColor: colors.textTertiary,
    opacity: 0.5,
  },
  addButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.lg,
    color: colors.textOnPrimary,
  },

  // Today's Total
  todayTotal: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  todayLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
  },
  todayValue: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
