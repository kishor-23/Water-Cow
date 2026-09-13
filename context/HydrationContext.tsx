/**
 * HydrationContext — Global state for the Water Cow app.
 */
import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import {
  type WaterEntry,
  type ReminderSettings,
  type UserProfile,
  DEFAULT_REMINDER_SETTINGS,
  DEFAULT_PROFILE,
  saveTodayEntries,
  loadTodayEntries,
  saveReminderSettings,
  loadReminderSettings,
  saveProfile,
  loadProfile,
  saveDayData,
  loadHistory,
  deleteEntryFromStorage,
  type DayData,
} from '../utils/storage';
import { getTodayKey } from '../utils/hydration';
import { scheduleReminders } from '../utils/notifications';
import { calculateCowMood, type CowMood } from '../constants/cowMoods';
import { updateNativeWidget, checkAndSyncWidgetQuickAdds } from '../utils/widget';

// --- State ---

interface HydrationState {
  entries: WaterEntry[];
  totalConsumed: number;
  profile: UserProfile;
  reminderSettings: ReminderSettings;
  history: DayData[];
  isLoading: boolean;
  lastDrinkTime: number;
  showSuccess: boolean;
}

const initialState: HydrationState = {
  entries: [],
  totalConsumed: 0,
  profile: DEFAULT_PROFILE,
  reminderSettings: DEFAULT_REMINDER_SETTINGS,
  history: [],
  isLoading: true,
  lastDrinkTime: Date.now(),
  showSuccess: false,
};

// --- Actions ---

type Action =
  | { type: 'LOAD_DATA'; entries: WaterEntry[]; profile: UserProfile; settings: ReminderSettings; history: DayData[] }
  | { type: 'ADD_WATER'; amount: number }
  | { type: 'DELETE_ENTRY'; id: string; dateKey?: string }
  | { type: 'UPDATE_HISTORY'; history: DayData[] }
  | { type: 'SET_GOAL'; goal: number }
  | { type: 'UPDATE_PROFILE'; profile: Partial<UserProfile> }
  | { type: 'UPDATE_REMINDERS'; settings: ReminderSettings }
  | { type: 'HIDE_SUCCESS' }
  | { type: 'RESET_DAY' };

function reducer(state: HydrationState, action: Action): HydrationState {
  switch (action.type) {
    case 'LOAD_DATA': {
      const total = action.entries.reduce((sum, e) => sum + e.amount, 0);
      const lastEntry = action.entries.length > 0
        ? Math.max(...action.entries.map((e) => e.timestamp))
        : Date.now();
      return {
        ...state,
        entries: action.entries,
        totalConsumed: total,
        profile: action.profile,
        reminderSettings: action.settings,
        history: action.history,
        isLoading: false,
        lastDrinkTime: lastEntry,
      };
    }

    case 'DELETE_ENTRY': {
      const todayKey = getTodayKey();
      const targetDate = action.dateKey || todayKey;

      const filterFn = (e: WaterEntry) => {
        if (e.id && action.id && e.id === action.id) return false;
        if (e.timestamp && action.id && String(e.timestamp) === String(action.id)) return false;
        return true;
      };

      if (targetDate === todayKey) {
        const newEntries = state.entries.filter(filterFn);
        const newTotal = newEntries.reduce((sum, e) => sum + e.amount, 0);
        const newHistory = state.history.map((d) =>
          d.date === todayKey ? { ...d, totalConsumed: newTotal, entries: newEntries } : d
        );
        return {
          ...state,
          entries: newEntries,
          totalConsumed: newTotal,
          history: newHistory,
        };
      } else {
        const newHistory = state.history.map((d) => {
          if (d.date === targetDate) {
            const updatedEnts = (d.entries || []).filter(filterFn);
            const updatedTotal = updatedEnts.reduce((sum, e) => sum + e.amount, 0);
            return {
              ...d,
              totalConsumed: updatedTotal,
              entries: updatedEnts,
            };
          }
          return d;
        });
        return {
          ...state,
          history: newHistory,
        };
      }
    }

    case 'UPDATE_HISTORY':
      return {
        ...state,
        history: action.history,
      };

    case 'ADD_WATER': {
      const newEntry: WaterEntry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        amount: action.amount,
        timestamp: Date.now(),
      };
      const newEntries = [...state.entries, newEntry];
      const newTotal = state.totalConsumed + action.amount;
      return {
        ...state,
        entries: newEntries,
        totalConsumed: newTotal,
        lastDrinkTime: Date.now(),
        showSuccess: true,
      };
    }

    case 'SET_GOAL':
      return {
        ...state,
        profile: { ...state.profile, dailyGoal: action.goal },
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.profile },
      };

    case 'UPDATE_REMINDERS':
      return {
        ...state,
        reminderSettings: action.settings,
      };

    case 'HIDE_SUCCESS':
      return { ...state, showSuccess: false };

    case 'RESET_DAY':
      return {
        ...state,
        entries: [],
        totalConsumed: 0,
        lastDrinkTime: Date.now(),
      };

    default:
      return state;
  }
}

// --- Context ---

interface HydrationContextValue {
  state: HydrationState;
  cowMood: CowMood;
  progress: number;
  addWater: (amount: number) => void;
  deleteEntry: (id: string, dateKey?: string) => Promise<void>;
  setGoal: (goal: number) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateReminders: (settings: ReminderSettings) => void;
  hideSuccess: () => void;
  reloadAllData: () => Promise<void>;
}

const HydrationContext = createContext<HydrationContextValue | null>(null);

export function HydrationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reloadAllData = useCallback(async () => {
    const [entries, profile, settings, history] = await Promise.all([
      loadTodayEntries(),
      loadProfile(),
      loadReminderSettings(),
      loadHistory(),
    ]);
    dispatch({ type: 'LOAD_DATA', entries, profile, settings, history });
    scheduleReminders(settings);

    // Sync any pending quick adds from Android Widget
    const pendingCount = await checkAndSyncWidgetQuickAdds();
    if (pendingCount > 0) {
      dispatch({ type: 'ADD_WATER', amount: 250 * pendingCount });
    }
  }, []);

  // Load saved data on mount
  useEffect(() => {
    reloadAllData();
  }, [reloadAllData]);

  // Persist entries when they change & update Android Widget
  useEffect(() => {
    if (!state.isLoading) {
      saveTodayEntries(state.entries);
      saveDayData({
        date: getTodayKey(),
        totalConsumed: state.totalConsumed,
        goal: state.profile.dailyGoal,
        entries: state.entries,
      });
      updateNativeWidget(state.totalConsumed, state.profile.dailyGoal);
    }
  }, [state.entries, state.totalConsumed, state.isLoading, state.profile.dailyGoal]);

  // Calculate derived values
  const progress = state.profile.dailyGoal > 0
    ? Math.min(state.totalConsumed / state.profile.dailyGoal, 1)
    : 0;

  const minutesSinceLastDrink = Math.floor(
    (Date.now() - state.lastDrinkTime) / (1000 * 60)
  );

  const cowMood = calculateCowMood(
    state.totalConsumed,
    state.profile.dailyGoal,
    minutesSinceLastDrink,
    state.reminderSettings.intervalMinutes
  );

  // Action creators
  const addWater = useCallback((amount: number) => {
    dispatch({ type: 'ADD_WATER', amount });
  }, []);

  const deleteEntry = useCallback(async (id: string, dateKey?: string) => {
    const todayKey = getTodayKey();
    const targetDate = dateKey || todayKey;
    dispatch({ type: 'DELETE_ENTRY', id, dateKey: targetDate });
    await deleteEntryFromStorage(id, targetDate);
    const updatedHistory = await loadHistory();
    dispatch({ type: 'UPDATE_HISTORY', history: updatedHistory });
  }, []);

  const setGoal = useCallback((goal: number) => {
    dispatch({ type: 'SET_GOAL', goal });
    saveProfile({ ...state.profile, dailyGoal: goal });
  }, [state.profile]);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', profile });
    saveProfile({ ...state.profile, ...profile });
  }, [state.profile]);

  const updateReminders = useCallback((settings: ReminderSettings) => {
    dispatch({ type: 'UPDATE_REMINDERS', settings });
    saveReminderSettings(settings);
    scheduleReminders(settings);
  }, []);

  const hideSuccess = useCallback(() => {
    dispatch({ type: 'HIDE_SUCCESS' });
  }, []);

  return (
    <HydrationContext.Provider
      value={{
        state,
        cowMood,
        progress,
        addWater,
        deleteEntry,
        setGoal,
        updateProfile,
        updateReminders,
        hideSuccess,
        reloadAllData,
      }}
    >
      {children}
    </HydrationContext.Provider>
  );
}

export function useHydration(): HydrationContextValue {
  const ctx = useContext(HydrationContext);
  if (!ctx) {
    throw new Error('useHydration must be used within a HydrationProvider');
  }
  return ctx;
}
