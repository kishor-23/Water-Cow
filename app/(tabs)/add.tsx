/**
 * Add Water Screen — Log water intake with customizable drink containers (Glass, Cup, Mug, Bottle)
 * and custom quick amounts.
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
} from 'react-native-reanimated';
import { CowReminderAnimated } from '../../components/cow/CowReminderAnimated';
import { PillButton } from '../../components/ui/PillButton';
import { Card } from '../../components/ui/Card';
import { FeatherIcon } from '../../components/ui/FeatherIcon';
import { DrinkIcon, type DrinkContainerType } from '../../components/ui/DrinkIcon';
import { useHydration } from '../../context/HydrationContext';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { formatWater } from '../../utils/hydration';
import { DEFAULT_CUP_SIZES, type CupSizes } from '../../utils/storage';

const QUICK_ADD_PRESETS = [150, 200, 250, 300, 400, 500];

const CONTAINER_CONFIGS: {
  key: keyof CupSizes;
  name: string;
  icon: DrinkContainerType;
  defaultAmount: number;
  presets: number[];
}[] = [
  { key: 'glass', name: 'Glass', icon: 'glass', defaultAmount: 150, presets: [100, 150, 200, 250] },
  { key: 'cup', name: 'Cup', icon: 'cup', defaultAmount: 250, presets: [200, 250, 300, 350] },
  { key: 'mug', name: 'Mug', icon: 'mug', defaultAmount: 350, presets: [300, 350, 400, 500] },
  { key: 'bottle', name: 'Bottle', icon: 'bottle', defaultAmount: 500, presets: [500, 650, 750, 1000] },
];

export default function AddWaterScreen() {
  const { addWater, state, hideSuccess, updateProfile } = useHydration();
  const { profile } = state;
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const cupSizes: CupSizes = profile.cupSizes || DEFAULT_CUP_SIZES;

  const [selectedAmount, setSelectedAmount] = useState(cupSizes.cup || 250);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [showDrinkingAnimation, setShowDrinkingAnimation] = useState(false);

  // State for editing a specific container's exact custom size
  const [editingContainerKey, setEditingContainerKey] = useState<keyof CupSizes | null>(null);
  const [editingAmountValue, setEditingAmountValue] = useState('');

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
    const amount = isCustom ? parseInt(customValue, 10) || 0 : selectedAmount;
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

  const updateContainerSize = (key: keyof CupSizes, amount: number) => {
    const validAmount = Math.max(50, Math.min(amount, 3000));
    const updated = {
      ...cupSizes,
      [key]: validAmount,
    };
    updateProfile({ cupSizes: updated });

    // If currently selected amount matched old size, update selected too
    if (!isCustom && selectedAmount === (cupSizes[key] || 0)) {
      setSelectedAmount(validAmount);
    }
  };

  const handleSaveCustomContainerSize = (key: keyof CupSizes) => {
    const parsed = parseInt(editingAmountValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateContainerSize(key, parsed);
    }
    setEditingContainerKey(null);
    setEditingAmountValue('');
  };

  const displayAmount = isCustom ? (parseInt(customValue, 10) || 0) : selectedAmount;

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

          {/* Quick Amounts & Container Log Card */}
          <Card style={styles.amountsCard}>
            <Text style={styles.sectionLabel}>Quick Vessels</Text>
            <View style={styles.vesselsRow}>
              {CONTAINER_CONFIGS.map((item) => {
                const currentSize = cupSizes[item.key] || item.defaultAmount;
                const isSelected = !isCustom && selectedAmount === currentSize;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.vesselBtn,
                      isSelected && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() => handleSelectAmount(currentSize)}
                    activeOpacity={0.75}
                  >
                    <DrinkIcon
                      type={item.icon}
                      size={20}
                      color={isSelected ? colors.textOnPrimary : colors.primary}
                    />
                    <Text
                      style={[
                        styles.vesselBtnName,
                        isSelected && { color: colors.textOnPrimary },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.vesselBtnAmount,
                        isSelected && { color: colors.textOnPrimary },
                      ]}
                    >
                      {currentSize} ml
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.customToggleRow}>
              <PillButton
                label={isCustom ? "Custom: " + (customValue || "0") + " ml" : "Enter Custom ml"}
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
                  placeholder="Enter amount in ml"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="number-pad"
                  cursorColor={colors.primary}
                  selectionColor={colors.primary}
                  autoFocus
                  maxLength={4}
                  returnKeyType="done"
                  onSubmitEditing={handleAddWater}
                />
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

          {/* CUSTOMIZE CONTAINER SIZES CARD */}
          <Card style={styles.amountsCard}>
            <View style={styles.sectionHeader}>
              <DrinkIcon type="bottle" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Customize Container Sizes</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Adjust your custom ml for Glass, Cup, Mug, and Bottle. These will update your 1-tap quick log buttons on the Home screen.
            </Text>

            <View style={styles.containersList}>
              {CONTAINER_CONFIGS.map((item) => {
                const currentSize = cupSizes[item.key] || item.defaultAmount;
                const isEditing = editingContainerKey === item.key;

                return (
                  <View key={item.key} style={styles.containerItemCard}>
                    <View style={styles.containerItemTop}>
                      <View style={styles.containerLeft}>
                        <View style={[styles.containerIconWrap, { backgroundColor: colors.surfaceBlue }]}>
                          <DrinkIcon type={item.icon} size={22} color={colors.primary} />
                        </View>
                        <View>
                          <Text style={styles.containerItemTitle}>{item.name}</Text>
                          <Text style={styles.containerItemSubtitle}>Current: {currentSize} ml</Text>
                        </View>
                      </View>

                      {/* Stepper Control */}
                      <View style={styles.stepperContainer}>
                        <TouchableOpacity
                          style={[styles.stepperButton, { backgroundColor: colors.surfaceBlue }]}
                          onPress={() => updateContainerSize(item.key, currentSize - 50)}
                          activeOpacity={0.7}
                        >
                          <FeatherIcon name="minus" size={16} color={colors.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.stepperValueBadge}
                          onPress={() => {
                            setEditingContainerKey(item.key);
                            setEditingAmountValue(String(currentSize));
                          }}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.stepperValueText, { color: colors.primary }]}>
                            {currentSize} ml
                          </Text>
                          <FeatherIcon name="edit-3" size={10} color={colors.primary} style={{ marginLeft: 3 }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.stepperButton, { backgroundColor: colors.surfaceBlue }]}
                          onPress={() => updateContainerSize(item.key, currentSize + 50)}
                          activeOpacity={0.7}
                        >
                          <FeatherIcon name="plus" size={16} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Inline Manual Input */}
                    {isEditing && (
                      <View style={styles.inlineEditWrap}>
                        <TextInput
                          style={[styles.inlineInput, { color: colors.textPrimary, borderColor: colors.primary }]}
                          value={editingAmountValue}
                          onChangeText={setEditingAmountValue}
                          placeholder={`Enter ${item.name} ml`}
                          placeholderTextColor={colors.textTertiary}
                          keyboardType="number-pad"
                          autoFocus
                          maxLength={4}
                          onSubmitEditing={() => handleSaveCustomContainerSize(item.key)}
                        />
                        <TouchableOpacity
                          style={[styles.inlineSaveBtn, { backgroundColor: colors.primary }]}
                          onPress={() => handleSaveCustomContainerSize(item.key)}
                        >
                          <Text style={styles.inlineSaveBtnText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.inlineCancelBtn}
                          onPress={() => {
                            setEditingContainerKey(null);
                            setEditingAmountValue('');
                          }}
                        >
                          <Text style={[styles.inlineCancelBtnText, { color: colors.textTertiary }]}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Preset Volume Chips */}
                    <View style={styles.chipsRow}>
                      {item.presets.map((preset) => {
                        const isPresetActive = currentSize === preset;
                        return (
                          <TouchableOpacity
                            key={preset}
                            style={[
                              styles.chipBtn,
                              isPresetActive && {
                                backgroundColor: colors.primary,
                                borderColor: colors.primary,
                              },
                            ]}
                            onPress={() => updateContainerSize(item.key, preset)}
                            activeOpacity={0.75}
                          >
                            <Text
                              style={[
                                styles.chipBtnText,
                                isPresetActive && { color: colors.textOnPrimary, fontFamily: Typography.fontFamily.bold },
                              ]}
                            >
                              {preset} ml
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Quick Add Default Amount Card */}
          <Card style={styles.amountsCard}>
            <View style={styles.sectionHeader}>
              <FeatherIcon name="plus-circle" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Home Quick Add Default</Text>
            </View>

            <View style={styles.currentGoal}>
              <Text style={styles.goalValue}>
                {formatWater(profile.quickAddAmount || 250)}
              </Text>
            </View>

            <Text style={styles.sectionLabel}>Default amount logged by "+ Quick" button</Text>
            <View style={styles.pillGrid}>
              {QUICK_ADD_PRESETS.map((amt) => (
                <PillButton
                  key={amt}
                  label={formatWater(amt)}
                  selected={(profile.quickAddAmount || 250) === amt}
                  onPress={() => updateProfile({ quickAddAmount: amt })}
                  size="md"
                />
              ))}
            </View>
          </Card>

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
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },

  // Header
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xxl,
    color: colors.textPrimary,
    textAlign: 'center',
    paddingTop: Spacing.xl,
    marginBottom: Spacing.md,
  },

  // Cow
  cowSection: {
    alignItems: 'center',
    marginBottom: Spacing.md,
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
    marginBottom: Spacing.lg,
  },
  amountValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 52,
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
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },

  // Vessels row in quick logging card
  vesselsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  vesselBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...Shadows.sm,
  },
  vesselBtnName: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 11,
    marginTop: 4,
    color: colors.textPrimary,
  },
  vesselBtnAmount: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 10,
    marginTop: 1,
    color: colors.textTertiary,
  },
  customToggleRow: {
    alignItems: 'center',
    marginTop: 4,
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
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: Spacing.md,
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

  // Add Button
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 15,
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

  // Containers Customization List
  containersList: {
    gap: Spacing.md,
  },
  containerItemCard: {
    backgroundColor: colors.surfaceBlue,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  containerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerItemTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
  },
  containerItemSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperValueText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  chipBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipBtnText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  inlineEditWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  inlineInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
  },
  inlineSaveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  inlineSaveBtnText: {
    color: '#FFF',
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xs,
  },
  inlineCancelBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  inlineCancelBtnText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
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

  // Section Header for Cards
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.lg,
    color: colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  currentGoal: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  goalValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 38,
    color: colors.primary,
  },
});
