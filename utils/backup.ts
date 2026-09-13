/**
 * Water Cow — Backup, Export, and Import Utilities as Files.
 * Supports iOS, Android, and Web platforms.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import {
  type WaterEntry,
  type ReminderSettings,
  type UserProfile,
  type DayData,
  loadTodayEntries,
  loadProfile,
  loadReminderSettings,
  loadHistory,
  saveTodayEntries,
  saveProfile,
  saveReminderSettings,
} from './storage';

export interface BackupPayload {
  version: number;
  appName: 'WaterCow';
  exportedAt: string;
  data: {
    profile: UserProfile;
    reminderSettings: ReminderSettings;
    history: DayData[];
    todayEntries: WaterEntry[];
    themeMode?: string;
  };
}

export async function createBackupPayload(): Promise<BackupPayload> {
  const profile = await loadProfile();
  const reminderSettings = await loadReminderSettings();
  const history = await loadHistory();
  const todayEntries = await loadTodayEntries();
  const themeMode = (await AsyncStorage.getItem('watercow_theme_mode')) || 'system';

  return {
    version: 1,
    appName: 'WaterCow',
    exportedAt: new Date().toISOString(),
    data: {
      profile,
      reminderSettings,
      history,
      todayEntries,
      themeMode,
    },
  };
}

export async function exportBackupFile(): Promise<{ success: boolean; message?: string }> {
  try {
    const backup = await createBackupPayload();
    const jsonString = JSON.stringify(backup, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `watercow_backup_${dateStr}.json`;

    // Web Platform: Trigger browser file download
    if (Platform.OS === 'web' || typeof document !== 'undefined') {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return { success: true };
    }

    // Native Platform (iOS / Android)
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return { success: false, message: 'Sharing is not supported on this device.' };
    }

    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Water Cow Backup File',
      UTI: 'public.json',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Export backup file error:', error);
    return { success: false, message: error?.message || 'Failed to export backup file.' };
  }
}

export async function importBackupFile(): Promise<{ success: boolean; message: string }> {
  try {
    // Web Platform: Trigger browser native file selector
    if (Platform.OS === 'web' || typeof document !== 'undefined') {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.style.display = 'none';

        input.onchange = async (e: any) => {
          try {
            const files = e.target?.files;
            if (!files || files.length === 0) {
              resolve({ success: false, message: 'File selection cancelled.' });
              return;
            }
            const file = files[0];
            const text = await file.text();
            const parsed = JSON.parse(text.trim());

            if (!parsed || parsed.appName !== 'WaterCow' || !parsed.data) {
              resolve({ success: false, message: 'Invalid Water Cow backup file format.' });
              return;
            }

            const { profile, reminderSettings, history, todayEntries, themeMode } = parsed.data;

            if (profile) await saveProfile(profile);
            if (reminderSettings) await saveReminderSettings(reminderSettings);
            if (Array.isArray(history)) await AsyncStorage.setItem('watercow_history', JSON.stringify(history));
            if (Array.isArray(todayEntries)) await saveTodayEntries(todayEntries);
            if (themeMode && (themeMode === 'light' || themeMode === 'dark' || themeMode === 'system')) {
              await AsyncStorage.setItem('watercow_theme_mode', themeMode);
            }

            resolve({ success: true, message: `Backup restored from ${file.name} successfully!` });
          } catch (err: any) {
            resolve({ success: false, message: err?.message || 'Failed to parse backup file.' });
          } finally {
            if (input.parentNode) {
              input.parentNode.removeChild(input);
            }
          }
        };

        input.oncancel = () => {
          if (input.parentNode) {
            input.parentNode.removeChild(input);
          }
          resolve({ success: false, message: 'File selection cancelled.' });
        };

        document.body.appendChild(input);
        input.click();
      });
    }

    // Native Platform (iOS / Android)
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/json', '*/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, message: 'File selection cancelled.' };
    }

    const selectedFile = result.assets[0];
    const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const parsed = JSON.parse(fileContent.trim());

    if (!parsed || parsed.appName !== 'WaterCow' || !parsed.data) {
      return { success: false, message: 'Invalid Water Cow backup file format.' };
    }

    const { profile, reminderSettings, history, todayEntries, themeMode } = parsed.data;

    if (profile) {
      await saveProfile(profile);
    }
    if (reminderSettings) {
      await saveReminderSettings(reminderSettings);
    }
    if (Array.isArray(history)) {
      await AsyncStorage.setItem('watercow_history', JSON.stringify(history));
    }
    if (Array.isArray(todayEntries)) {
      await saveTodayEntries(todayEntries);
    }
    if (themeMode && (themeMode === 'light' || themeMode === 'dark' || themeMode === 'system')) {
      await AsyncStorage.setItem('watercow_theme_mode', themeMode);
    }

    return { success: true, message: `Backup restored from ${selectedFile.name} successfully!` };
  } catch (error: any) {
    console.error('Import backup file error:', error);
    return { success: false, message: error?.message || 'Failed to parse and import backup file.' };
  }
}
