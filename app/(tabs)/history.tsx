import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useHydration } from '../../context/HydrationContext';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Card } from '../../components/ui/Card';
import { BarChart } from '../../components/ui/BarChart';
import { GlassWaterView } from '../../components/ui/GlassWaterView';
import { StatsCard } from '../../components/ui/StatsCard';
import { useTheme, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  formatWater,
  formatLiters,
  getDateKey,
  getDayName,
  getTodayKey,
} from '../../utils/hydration';
import { loadEntriesForDate, type WaterEntry } from '../../utils/storage';

const PERIODS = ['Day', 'Week', 'Month'];

export default function HistoryScreen() {
  const { state, deleteEntry, addWater } = useHydration();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [selectedPeriod, setSelectedPeriod] = useState(0); // Default: Day (Glass view)
  const todayKey = getTodayKey();

  // Calendar month state
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [selectedDateEntries, setSelectedDateEntries] = useState<WaterEntry[]>([]);

  // Delete Confirmation Modal State
  const [entryToDelete, setEntryToDelete] = useState<{ entry: WaterEntry; dateKey: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Month & Year Picker State
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const { history, totalConsumed, profile, entries: todayEntries } = state;

  // Load entries for selected calendar date if not today
  useEffect(() => {
    if (selectedDateKey === todayKey) {
      setSelectedDateEntries(todayEntries);
    } else {
      loadEntriesForDate(selectedDateKey).then((ents) => {
        if (ents.length > 0) {
          setSelectedDateEntries(ents);
        } else {
          // Fallback to history entry data if available
          const dayHistory = history.find((h) => h.date === selectedDateKey);
          setSelectedDateEntries(dayHistory?.entries || []);
        }
      });
    }
  }, [selectedDateKey, todayKey, todayEntries, history]);

  // Week chart data
  const weekChartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const dateKey = getDateKey(i);
      const dayData = history.find((d) => d.date === dateKey);

      if (i === 0) {
        data.push({
          label: getDayName(dateKey),
          value: totalConsumed,
          goal: profile.dailyGoal,
          date: dateKey,
        });
      } else {
        data.push({
          label: getDayName(dateKey),
          value: dayData?.totalConsumed || 0,
          goal: dayData?.goal || profile.dailyGoal,
          date: dateKey,
        });
      }
    }
    return data;
  }, [history, totalConsumed, profile.dailyGoal]);

  // Full Month Calendar Days Generation
  const calendarMonthData = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth(); // 0-indexed

    // Days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    // Weekday of 1st day (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDayWeekday = new Date(year, month, 1).getDay();

    const cells = [];

    // Preceding empty placeholder cells
    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push({ isPlaceholder: true, key: `pre-${i}` });
    }

    // Days in month
    const now = new Date();
    const nowKey = getTodayKey();

    for (let day = 1; day <= totalDays; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateKey === nowKey;
      const isFuture = dateKey > nowKey;

      let consumedMl = 0;
      let goalMl = profile.dailyGoal;

      if (isToday) {
        consumedMl = totalConsumed;
      } else {
        const dayRecord = history.find((h) => h.date === dateKey);
        if (dayRecord) {
          consumedMl = dayRecord.totalConsumed;
          goalMl = dayRecord.goal || profile.dailyGoal;
        }
      }

      cells.push({
        isPlaceholder: false,
        key: dateKey,
        dayNumber: day,
        dateKey,
        isToday,
        isFuture,
        consumed: consumedMl,
        goal: goalMl,
        progress: goalMl > 0 ? consumedMl / goalMl : 0,
      });
    }

    // Trailing empty placeholder cells to complete the 7-column grid
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        cells.push({ isPlaceholder: true, key: `post-${i}` });
      }
    }

    return cells;
  }, [currentCalendarDate, history, totalConsumed, profile.dailyGoal]);

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    if (!isNextMonthDisabled) {
      setCurrentCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const isNextMonthDisabled = useMemo(() => {
    const next = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1);
    const now = new Date();
    if (next.getFullYear() > now.getFullYear()) return true;
    if (next.getFullYear() === now.getFullYear() && next.getMonth() > now.getMonth()) return true;
    return false;
  }, [currentCalendarDate]);

  const handleSelectMonthYear = (monthIndex: number) => {
    const selectedDate = new Date(pickerYear, monthIndex, 1);
    const now = new Date();
    if (selectedDate.getFullYear() > now.getFullYear() || (selectedDate.getFullYear() === now.getFullYear() && selectedDate.getMonth() > now.getMonth())) {
       return;
    }
    setCurrentCalendarDate(selectedDate);
    setShowPicker(false);
  };

  // Month & Year string
  const monthYearTitle = useMemo(() => {
    return currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentCalendarDate]);

  // Open In-App Delete Confirmation Dialog
  const handleDeleteLog = (entry: WaterEntry, dateKey: string) => {
    setEntryToDelete({ entry, dateKey });
  };

  // User Approved Delete Execution
  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    setIsDeleting(true);
    try {
      const { entry, dateKey } = entryToDelete;
      const entryId = entry.id || String(entry.timestamp);

      // Execute delete in context and persistence
      await deleteEntry(entryId, dateKey);

      // Instantly update local selectedDateEntries view
      setSelectedDateEntries((prev) =>
        prev.filter((e) => e.id !== entryId && String(e.timestamp) !== entryId)
      );

      if (dateKey !== todayKey) {
        const updated = await loadEntriesForDate(dateKey);
        setSelectedDateEntries(updated);
      }
    } catch (err) {
      console.warn('Error deleting entry:', err);
    } finally {
      setIsDeleting(false);
      setEntryToDelete(null);
    }
  };

  // Selected date data breakdown
  const selectedDayInfo = useMemo(() => {
    if (selectedDateKey === todayKey) {
      return {
        dateKey: todayKey,
        total: totalConsumed,
        goal: profile.dailyGoal,
        entries: todayEntries,
        isToday: true,
      };
    }
    const dayRecord = history.find((h) => h.date === selectedDateKey);
    return {
      dateKey: selectedDateKey,
      total: dayRecord?.totalConsumed || 0,
      goal: dayRecord?.goal || profile.dailyGoal,
      entries: selectedDateEntries,
      isToday: false,
    };
  }, [selectedDateKey, todayKey, totalConsumed, profile.dailyGoal, todayEntries, history, selectedDateEntries]);

  // Summary statistics for Period
  const summaryStats = useMemo(() => {
    if (selectedPeriod === 0) {
      // Day
      return {
        total: totalConsumed,
        dailyAvg: totalConsumed,
        completionRate: profile.dailyGoal > 0 ? Math.round(Math.min(totalConsumed / profile.dailyGoal, 1) * 100) : 0,
        goalsCompleted: totalConsumed >= profile.dailyGoal ? 1 : 0,
      };
    }

    if (selectedPeriod === 1) {
      // Week
      const totalWeek = weekChartData.reduce((sum, d) => sum + d.value, 0);
      const activeDays = weekChartData.filter((d) => d.value > 0).length || 1;
      const goalsMet = weekChartData.filter((d) => d.goal > 0 && d.value >= d.goal).length;
      return {
        total: totalWeek,
        dailyAvg: Math.round(totalWeek / activeDays),
        completionRate: Math.round((goalsMet / 7) * 100),
        goalsCompleted: goalsMet,
      };
    }

    // Month
    const validDays = calendarMonthData.filter((c: any) => !c.isPlaceholder && !c.isFuture);
    const totalMonth = validDays.reduce((sum: number, c: any) => sum + (c.consumed || 0), 0);
    const activeMonthDays = validDays.filter((c: any) => c.consumed > 0).length || 1;
    const goalsMetMonth = validDays.filter((c: any) => c.goal > 0 && c.consumed >= c.goal).length;
    return {
      total: totalMonth,
      dailyAvg: Math.round(totalMonth / activeMonthDays),
      completionRate: validDays.length > 0 ? Math.round((goalsMetMonth / validDays.length) * 100) : 0,
      goalsCompleted: goalsMetMonth,
    };
  }, [selectedPeriod, totalConsumed, profile.dailyGoal, weekChartData, calendarMonthData]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>History</Text>

        {/* Period Selector */}
        <View style={styles.segmentContainer}>
          <SegmentedControl
            options={PERIODS}
            selected={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </View>

        {/* --- 1. DAY VIEW: Realistic Glass Water Filling & Multi-Glasses --- */}
        {selectedPeriod === 0 && (
          <Card style={styles.chartCard}>
            <Text style={styles.cardHeaderTitle}>Today's Water Intake</Text>
            <GlassWaterView
              consumed={totalConsumed}
              goal={profile.dailyGoal}
              onQuickAdd={addWater}
            />
          </Card>
        )}

        {/* --- 2. WEEK VIEW: Bar Chart --- */}
        {selectedPeriod === 1 && (
          <Card style={styles.chartCard}>
            <Text style={styles.cardHeaderTitle}>This Week's Overview</Text>
            <BarChart data={weekChartData} height={200} />
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Water consumed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary, opacity: 0.3 }]} />
                <Text style={styles.legendText}>Daily goal</Text>
              </View>
            </View>
          </Card>
        )}

        {/* --- 3. MONTH VIEW: Real Navigable Calendar with Water Liters Track --- */}
        {selectedPeriod === 2 && (
          <Card style={styles.chartCard}>
            {/* Month Nav Header */}
            <View style={styles.monthNavRow}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.navArrowBtn}>
                <Feather name="chevron-left" size={20} color={colors.textPrimary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setPickerYear(currentCalendarDate.getFullYear()); setShowPicker(true); }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.monthYearText}>{monthYearTitle}</Text>
                  <Feather name="chevron-down" size={16} color={colors.textPrimary} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextMonth}
                disabled={isNextMonthDisabled}
                style={[styles.navArrowBtn, isNextMonthDisabled && { opacity: 0.3 }]}
              >
                <Feather name="chevron-right" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Weekday Labels */}
            <View style={styles.weekLabelsRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, idx) => (
                <Text key={idx} style={styles.weekLabelText}>{w}</Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarMonthData.map((cell: any) => {
                if (cell.isPlaceholder) {
                  return <View key={cell.key} style={styles.calendarPlaceholder} />;
                }

                const isSelected = selectedDateKey === cell.dateKey;
                const hasConsumed = cell.consumed > 0;
                const isGoalMet = cell.progress >= 1;

                // Color cell background based on hydration level
                let cellBg: string = colors.surfaceBlue;
                let litersColor: string = colors.textTertiary;

                if (cell.isFuture) {
                  cellBg = 'transparent';
                } else if (isGoalMet) {
                  cellBg = colors.surfaceBlueDark || '#E0F2FE';
                  litersColor = colors.primary;
                } else if (hasConsumed) {
                  cellBg = colors.surfaceBlue;
                  litersColor = colors.primary;
                }

                return (
                  <TouchableOpacity
                    key={cell.key}
                    disabled={cell.isFuture}
                    onPress={() => setSelectedDateKey(cell.dateKey)}
                    style={[
                      styles.calendarDateCell,
                      { backgroundColor: cellBg },
                      cell.isToday && styles.todayDateCell,
                      isSelected && styles.selectedDateCell,
                      cell.isFuture && { opacity: 0.35 },
                    ]}
                    activeOpacity={0.7}
                  >
                    {/* Day Number */}
                    <Text
                      style={[
                        styles.calendarDayNum,
                        cell.isToday && { color: colors.primary, fontFamily: Typography.fontFamily.bold },
                        isSelected && { color: colors.primary },
                      ]}
                    >
                      {cell.dayNumber}
                    </Text>

                    {/* Water Track: Liters badge */}
                    {hasConsumed && !cell.isFuture ? (
                      <View style={styles.litersBadge}>
                        <Text style={[styles.litersBadgeText, { color: litersColor }]}>
                          {(cell.consumed / 1000).toFixed(1)}L
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.litersEmptyDot} />
                    )}

                    {/* Goal Met Star / Dot Indicator */}
                    {isGoalMet && (
                      <View style={[styles.goalMetIndicator, { backgroundColor: colors.primary }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        )}

        {/* Summary Stats */}
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.statsRow}>
          <StatsCard
            icon="droplet"
            value={formatWater(summaryStats.total)}
            label="Total consumed"
            color={colors.primary}
          />
          <View style={{ width: Spacing.sm }} />
          <StatsCard
            icon="trending-up"
            value={formatWater(summaryStats.dailyAvg)}
            label="Daily average"
            color={colors.accentCyan}
          />
        </View>

        <View style={[styles.statsRow, { marginTop: Spacing.sm }]}>
          <StatsCard
            icon="award"
            value={`${summaryStats.completionRate}%`}
            label="Goal rate"
            color={colors.success}
          />
          <View style={{ width: Spacing.sm }} />
          <StatsCard
            icon="check-circle"
            value={`${summaryStats.goalsCompleted}`}
            label="Goals met"
            color={colors.success}
          />
        </View>

        {/* Selected Date Log Breakdown (Fixed Height & Scrollable Container) */}
        <View style={styles.logSectionHeader}>
          <View style={styles.logSectionTitleRow}>
            <Text style={styles.sectionTitle}>
              {selectedPeriod === 2
                ? `Logs: ${new Date(selectedDateKey + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short',
                  })}`
                : "Today's Log"}
            </Text>
            {selectedDayInfo.entries.length > 0 && (
              <View style={[styles.logCountBadge, { backgroundColor: colors.surfaceBlue }]}>
                <Text style={[styles.logCountText, { color: colors.primary }]}>
                  {selectedDayInfo.entries.length}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.logTotalSub}>
            {formatWater(selectedDayInfo.total)} / {formatWater(selectedDayInfo.goal)}
          </Text>
        </View>

        {/* Scrollable Fixed Height Log Container */}
        <View style={[styles.logScrollContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {selectedDayInfo.entries.length > 0 ? (
            <ScrollView
              style={styles.logScrollView}
              contentContainerStyle={styles.logScrollContent}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {selectedDayInfo.entries.map((entry, idx) => (
                <View
                  key={entry.id}
                  style={[
                    styles.logEntryItem,
                    idx < selectedDayInfo.entries.length - 1 && [styles.logEntryBorder, { borderBottomColor: colors.border }],
                  ]}
                >
                  <View style={styles.logRow}>
                    <View style={styles.logIcon}>
                      <Feather name="droplet" size={16} color={colors.primary} />
                    </View>

                    <View style={styles.logInfo}>
                      <Text style={styles.logAmount}>{formatWater(entry.amount)}</Text>
                      <Text style={styles.logTime}>
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </Text>
                    </View>

                    {/* Delete Log Button */}
                    <TouchableOpacity
                      style={styles.deleteLogBtn}
                      onPress={() => handleDeleteLog(entry, selectedDayInfo.dateKey)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Feather name="trash-2" size={18} color={colors.error || '#EF4444'} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyLogCard}>
              <Feather name="coffee" size={24} color={colors.textTertiary} />
              <Text style={styles.emptyLogText}>No water logged for this day</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation In-App Modal */}
      <Modal
        visible={!!entryToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeleting && setEntryToDelete(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmDialog, { backgroundColor: colors.surface }]}>
            <View style={styles.confirmIconContainer}>
              <Feather name="trash-2" size={26} color="#EF4444" />
            </View>

            <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>
              Delete Water Log?
            </Text>

            <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>
              Are you sure you want to delete this log of{' '}
              <Text style={{ fontWeight: 'bold', color: colors.primary }}>
                {entryToDelete ? formatWater(entryToDelete.entry.amount) : ''}
              </Text>
              {entryToDelete
                ? ` recorded at ${new Date(entryToDelete.entry.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}`
                : ''}?
            </Text>

            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmCancelBtn, { backgroundColor: colors.surfaceBlue }]}
                onPress={() => setEntryToDelete(null)}
                disabled={isDeleting}
                activeOpacity={0.7}
              >
                <Text style={[styles.confirmCancelText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmDeleteBtn, { opacity: isDeleting ? 0.6 : 1 }]}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
                activeOpacity={0.85}
              >
                <Feather name="trash-2" size={16} color="#FFFFFF" />
                <Text style={styles.confirmDeleteText}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Month Year Picker Modal */}
      <Modal visible={showPicker} transparent={true} animationType="fade" onRequestClose={() => setShowPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Month</Text>
            
            {/* Year Selector */}
            <View style={styles.yearSelectorRow}>
              <TouchableOpacity onPress={() => setPickerYear(y => y - 1)} style={styles.navArrowBtn}>
                <Feather name="chevron-left" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.pickerYearText, { color: colors.primary }]}>{pickerYear}</Text>
              <TouchableOpacity 
                onPress={() => setPickerYear(y => y + 1)} 
                style={[styles.navArrowBtn, pickerYear >= new Date().getFullYear() && { opacity: 0.3 }]}
                disabled={pickerYear >= new Date().getFullYear()}
              >
                <Feather name="chevron-right" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Months Grid */}
            <View style={styles.monthsGrid}>
              {MONTHS_SHORT.map((m, idx) => {
                const now = new Date();
                const isFuture = pickerYear > now.getFullYear() || (pickerYear === now.getFullYear() && idx > now.getMonth());
                const isSelected = currentCalendarDate.getFullYear() === pickerYear && currentCalendarDate.getMonth() === idx;
                
                return (
                  <TouchableOpacity
                    key={m}
                    disabled={isFuture}
                    onPress={() => handleSelectMonthYear(idx)}
                    style={[
                      styles.monthCell,
                      isSelected && { backgroundColor: colors.primary },
                      isFuture && { opacity: 0.3 }
                    ]}
                  >
                    <Text style={[
                      styles.monthCellText,
                      { color: isSelected ? colors.textOnPrimary : colors.textPrimary }
                    ]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <TouchableOpacity onPress={() => setShowPicker(false)} style={[styles.modalCancelBtn, { backgroundColor: colors.surfaceBlue }]}>
              <Text style={[styles.modalCancelText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  segmentContainer: {
    marginBottom: Spacing.xl,
  },

  // Card Header
  chartCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  cardHeaderTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  // Chart Legend
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
  },

  // Month Navigation
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  navArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYearText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
  },

  // Week Labels
  weekLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  weekLabelText: {
    width: '13.5%',
    textAlign: 'center',
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
  },

  // Calendar Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  calendarPlaceholder: {
    width: '13.5%',
    aspectRatio: 0.85,
  },
  calendarDateCell: {
    width: '13.5%',
    aspectRatio: 0.85,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  todayDateCell: {
    borderColor: colors.primaryLight,
  },
  selectedDateCell: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceBlueDark || '#BAE6FD',
    ...Shadows.sm,
  },
  calendarDayNum: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.xs,
    color: colors.textPrimary,
  },
  litersBadge: {
    marginTop: 2,
    paddingHorizontal: 2,
  },
  litersBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 9,
  },
  litersEmptyDot: {
    height: 12,
  },
  goalMetIndicator: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Section Titles
  sectionTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.lg,
    color: colors.textPrimary,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },

  // Log List
  logSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  logSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logCountBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  logCountText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
  },
  logTotalSub: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
    color: colors.primary,
    marginBottom: Spacing.md,
  },

  // Fixed Height & Scrollable Log Container
  logScrollContainer: {
    height: 230,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  logScrollView: {
    flex: 1,
  },
  logScrollContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  logEntryItem: {
    paddingVertical: Spacing.sm,
  },
  logEntryBorder: {
    borderBottomWidth: 1,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  logAmount: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
    color: colors.textPrimary,
  },
  logTime: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  deleteLogBtn: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },

  emptyLogCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
  },
  emptyLogText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: colors.textTertiary,
  },

  // Month Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.lg,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  yearSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  pickerYearText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xl,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  monthCell: {
    width: '30%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  monthCellText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
  },
  modalCancelBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalCancelText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.md,
  },

  // Confirmation Modal
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  confirmDialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  confirmIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  confirmTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.lg,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  confirmMessage: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.sm,
  },
  confirmDeleteBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    ...Shadows.sm,
  },
  confirmDeleteText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.sm,
    color: '#FFFFFF',
  },
});
