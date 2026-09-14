/**
 * AsyncStorage helpers for persisting hydration data.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from './hydration';

const KEYS = {
  ENTRIES: 'watercow_entries_',
  SETTINGS: 'watercow_settings',
  HISTORY: 'watercow_history',
  PROFILE: 'watercow_profile',
};

export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: number;
}

export interface ReminderSettings {
  enabled: boolean;
  intervalMinutes: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  snoozeDuration: number;
  sound: string;
}

export interface UserProfile {
  name: string;
  unit: 'ml' | 'oz';
  dailyGoal: number;
  quickAddAmount?: number;
}

export interface DayData {
  date: string;
  totalConsumed: number;
  goal: number;
  entries: WaterEntry[];
}

// --- Entries ---

export async function saveTodayEntries(entries: WaterEntry[]): Promise<void> {
  const key = KEYS.ENTRIES + getTodayKey();
  await AsyncStorage.setItem(key, JSON.stringify(entries));
}

export async function loadTodayEntries(): Promise<WaterEntry[]> {
  try {
    const key = KEYS.ENTRIES + getTodayKey();
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load today entries:', e);
    return [];
  }
}

export async function loadEntriesForDate(dateKey: string): Promise<WaterEntry[]> {
  try {
    const key = KEYS.ENTRIES + dateKey;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load entries for date:', e);
    return [];
  }
}

export async function saveEntriesForDate(dateKey: string, entries: WaterEntry[]): Promise<void> {
  const key = KEYS.ENTRIES + dateKey;
  await AsyncStorage.setItem(key, JSON.stringify(entries));
}

export async function deleteEntryFromStorage(id: string, dateKey?: string): Promise<{ entries: WaterEntry[]; total: number; date: string }> {
  const targetDate = dateKey || getTodayKey();
  const key = KEYS.ENTRIES + targetDate;
  
  // 1. Check direct entries store
  const data = await AsyncStorage.getItem(key);
  let entries: WaterEntry[] = data ? JSON.parse(data) : [];

  // 2. Check history store
  const historyStr = await AsyncStorage.getItem(KEYS.HISTORY);
  const history: DayData[] = historyStr ? JSON.parse(historyStr) : [];
  const historyIdx = history.findIndex((d) => d.date === targetDate);

  if (entries.length === 0 && historyIdx >= 0 && history[historyIdx].entries) {
    entries = history[historyIdx].entries;
  }

  // Filter matching entry by id OR timestamp string
  const updatedEntries = entries.filter((e) => {
    if (e.id && id && e.id === id) return false;
    if (e.timestamp && id && String(e.timestamp) === String(id)) return false;
    return true;
  });

  await AsyncStorage.setItem(key, JSON.stringify(updatedEntries));

  const total = updatedEntries.reduce((sum, e) => sum + e.amount, 0);

  // Update history record
  if (historyIdx >= 0) {
    history[historyIdx] = {
      ...history[historyIdx],
      totalConsumed: total,
      entries: updatedEntries,
    };
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } else {
    // If not found in history yet, create/update history record for this date
    history.push({
      date: targetDate,
      totalConsumed: total,
      goal: 2000,
      entries: updatedEntries,
    });
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  }

  return { entries: updatedEntries, total, date: targetDate };
}

// --- History ---

export async function saveDayData(dayData: DayData): Promise<void> {
  const historyStr = await AsyncStorage.getItem(KEYS.HISTORY);
  const history: DayData[] = historyStr ? JSON.parse(historyStr) : [];

  const idx = history.findIndex((d) => d.date === dayData.date);
  if (idx >= 0) {
    history[idx] = dayData;
  } else {
    history.push(dayData);
  }

  // Keep last 90 days
  const sorted = history.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 90);
  await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(sorted));
}

export async function loadHistory(): Promise<DayData[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load history:', e);
    return [];
  }
}

// --- Settings ---

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: true,
  intervalMinutes: 60,
  startHour: 8,
  startMinute: 0,
  endHour: 22,
  endMinute: 0,
  snoozeDuration: 10,
  sound: 'cow_moo',
};

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function loadReminderSettings(): Promise<ReminderSettings> {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(data) } : DEFAULT_REMINDER_SETTINGS;
  } catch (e) {
    console.warn('Failed to load reminder settings:', e);
    return DEFAULT_REMINDER_SETTINGS;
  }
}

// --- Profile ---

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Buddy',
  unit: 'ml',
  dailyGoal: 2000,
  quickAddAmount: 250,
};

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROFILE);
    if (!data) return DEFAULT_PROFILE;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      quickAddAmount: parsed.quickAddAmount || 250,
      name: parsed.name && parsed.name.trim() ? parsed.name.trim() : 'Buddy',
    };
  } catch (e) {
    console.warn('Failed to load profile:', e);
    return DEFAULT_PROFILE;
  }
}
