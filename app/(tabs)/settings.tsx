import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useHydration } from '../../context/HydrationContext';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { CowReminderAnimated } from '../../components/cow/CowReminderAnimated';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { exportBackupFile, importBackupFile } from '../../utils/backup';
import { HomeScreenWidgetModal } from '../../components/ui/HomeScreenWidgetModal';

const GOAL_PRESETS = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

export default function SettingsScreen() {
  const { state, setGoal, updateProfile, cowMood, reloadAllData } = useHydration();
  const { colors, themeMode, setThemeMode, isDark } = useTheme();
  const styles = getStyles(colors);
  const { profile, totalConsumed } = state;
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [name, setName] = useState(profile.name);
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    setName(profile.name);
  }, [profile.name]);

  // Backup & Import state
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleNameSave = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
      setEditingName(false);
    }
  };

  const handleUnitToggle = () => {
    updateProfile({
      unit: profile.unit === 'ml' ? 'oz' : 'ml',
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    const result = await exportBackupFile();
    setIsExporting(false);
    if (!result.success && result.message) {
      Alert.alert('Export Failed', result.message);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    const result = await importBackupFile();
    setIsImporting(false);

    if (result.success) {
      await reloadAllData();
      Alert.alert('Success', result.message);
    } else if (result.message !== 'File selection cancelled.') {
      Alert.alert('Import Failed', result.message);
    }
  };

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
          <Text style={styles.title}>Settings</Text>

          {/* Cow */}
          <View style={styles.cowSection}>
            <CowReminderAnimated
              initialPose="sipping"
              hidePoseSelector={true}
              hideTapHint={true}
              size={100}
            />
          </View>

          {/* Daily Goal */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="target" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Daily Goal</Text>
            </View>

            <View style={styles.currentGoal}>
              <Text style={styles.goalValue}>
                {(profile.dailyGoal / 1000).toFixed(1)}
              </Text>
              <Text style={styles.goalUnit}>L</Text>
            </View>

            <Text style={styles.sectionLabel}>Choose your daily target</Text>
            <View style={styles.pillRow}>
              {GOAL_PRESETS.map((goal) => (
                <PillButton
                  key={goal}
                  label={`${(goal / 1000).toFixed(1)} L`}
                  selected={profile.dailyGoal === goal}
                  onPress={() => setGoal(goal)}
                  size="md"
                />
              ))}
            </View>
          </Card>

          {/* Profile */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="user" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Profile</Text>
            </View>

            {/* Name */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Name</Text>
              {editingName ? (
                <View style={styles.nameEditRow}>
                  <TextInput
                    style={styles.nameInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                    placeholderTextColor={colors.textTertiary}
                    cursorColor={colors.primary}
                    selectionColor={colors.primary}
                    onSubmitEditing={handleNameSave}
                    returnKeyType="done"
                    autoFocus
                    maxLength={20}
                  />
                  <TouchableOpacity onPress={handleNameSave}>
                    <Feather name="check" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
              <TouchableOpacity
                style={styles.settingValueRow}
                onPress={() => setEditingName(true)}
              >
                <Text style={styles.settingValue}>{profile.name}</Text>
                <Feather name="edit-2" size={14} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.settingDivider} />

          {/* Unit */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Preferred unit</Text>
            <TouchableOpacity
              style={styles.unitToggle}
              onPress={handleUnitToggle}
            >
              <View
                style={[
                  styles.unitOption,
                  profile.unit === 'ml' && styles.unitOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    profile.unit === 'ml' && styles.unitTextActive,
                  ]}
                >
                  ml
                </Text>
              </View>
              <View
                style={[
                  styles.unitOption,
                  profile.unit === 'oz' && styles.unitOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    profile.unit === 'oz' && styles.unitTextActive,
                  ]}
                >
                  oz
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Appearance / Theme */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name={isDark ? "moon" : "sun"} size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>

          <View style={styles.themeSelector}>
            {[
              { label: 'Light', mode: 'light' as const, icon: 'sun' as const },
              { label: 'Dark', mode: 'dark' as const, icon: 'moon' as const },
              { label: 'System', mode: 'system' as const, icon: 'smartphone' as const },
            ].map((item) => {
              const isSelected = themeMode === item.mode;
              return (
                <TouchableOpacity
                  key={item.mode}
                  style={[
                    styles.themeOption,
                    isSelected && { backgroundColor: colors.primary },
                    !isSelected && { backgroundColor: colors.surfaceBlue },
                  ]}
                  onPress={() => setThemeMode(item.mode)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={item.icon}
                    size={16}
                    color={isSelected ? colors.textOnPrimary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: isSelected ? colors.textOnPrimary : colors.textSecondary }
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Android Home Screen Widget */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="smartphone" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Home Screen Widget</Text>
          </View>
          <Text style={styles.backupDescription}>
            Add the Water Cow widget to your Android home screen to track live liters consumed today and log water with one tap.
          </Text>

          <TouchableOpacity
            style={[styles.backupButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowWidgetModal(true)}
            activeOpacity={0.85}
          >
            <Feather name="smartphone" size={18} color={colors.textOnPrimary} />
            <Text style={[styles.backupButtonText, { color: colors.textOnPrimary }]}>
              View & Setup Widget
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Backup & Restore */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="hard-drive" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Backup & Data</Text>
          </View>
          <Text style={styles.backupDescription}>
            Export your hydration history, reminder settings, and profile data to share or save as a backup.
          </Text>

          <View style={styles.backupActions}>
            <TouchableOpacity
              style={[
                styles.backupButton,
                { backgroundColor: colors.primary, opacity: isExporting ? 0.7 : 1 },
              ]}
              onPress={handleExport}
              disabled={isExporting}
              activeOpacity={0.8}
            >
              <Feather name="upload-cloud" size={18} color={colors.textOnPrimary} />
              <Text style={[styles.backupButtonText, { color: colors.textOnPrimary }]}>
                {isExporting ? 'Exporting...' : 'Export File'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.backupButton,
                {
                  backgroundColor: colors.surfaceBlue,
                  borderColor: colors.border,
                  borderWidth: 1,
                  opacity: isImporting ? 0.7 : 1,
                },
              ]}
              onPress={handleImport}
              disabled={isImporting}
              activeOpacity={0.8}
            >
              <Feather name="download-cloud" size={18} color={colors.primary} />
              <Text style={[styles.backupButtonText, { color: colors.primary }]}>
                {isImporting ? 'Importing...' : 'Import File'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* About */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <View style={styles.aboutContent}>
            <Text style={styles.appName}>Water Cow 🐄💧</Text>
            <Text style={styles.appTagline}>
              Simple hydration tracking.{'\n'}A little moo to remind you.
            </Text>
          </View>
        </Card>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Android Home Screen Widget Modal */}
      <HomeScreenWidgetModal
        visible={showWidgetModal}
        onClose={() => setShowWidgetModal(false)}
        consumed={totalConsumed}
        goal={profile.dailyGoal}
      />
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
    paddingTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },

  cowSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  // Section Card
  sectionCard: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.lg,
    color: colors.textPrimary,
  },
  sectionLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },

  // Goal
  currentGoal: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  goalValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 48,
    color: colors.primary,
  },
  goalUnit: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xl,
    color: colors.textTertiary,
    marginLeft: Spacing.xs,
  },

  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },



  // Settings Rows
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
  },
  settingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingValue: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.md,
    color: colors.textSecondary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: Spacing.xs,
  },

  // Name Edit
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nameInput: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceBlue,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    minWidth: 120,
  },

  // Unit Toggle
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceBlue,
    borderRadius: BorderRadius.full,
    padding: 2,
  },
  unitOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
  },
  unitOptionActive: {
    backgroundColor: colors.primary,
  },
  unitText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
  },
  unitTextActive: {
    color: colors.textOnPrimary,
  },

  // Theme Selector
  themeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  themeOptionText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
  },

  // Backup & Restore
  backupDescription: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  backupActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  backupButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  backupButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
  },

  // About
  aboutContent: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  appName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xl,
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  appTagline: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  appVersion: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
  },
});
