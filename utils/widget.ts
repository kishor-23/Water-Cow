/**
 * Native Android Home Screen Widget sync utilities.
 */
import { NativeModules, Platform } from 'react-native';
import { getTodayKey } from './hydration';

const { WaterCowWidget } = NativeModules;

/**
 * Updates the native Android Home Screen Widget with live consumed water and goal.
 */
export function updateNativeWidget(consumedMl: number, goalMl: number): void {
  if (Platform.OS !== 'android' || !WaterCowWidget) return;
  try {
    WaterCowWidget.updateWidget(consumedMl, goalMl, getTodayKey());
  } catch (e) {
    console.warn('Failed to update native widget:', e);
  }
}

/**
 * Checks if the user tapped quick add on the Android Home Screen Widget and returns count.
 */
export async function checkAndSyncWidgetQuickAdds(): Promise<number> {
  if (Platform.OS !== 'android' || !WaterCowWidget) return 0;
  try {
    const pendingCount: number = await WaterCowWidget.getPendingQuickAdds();
    return pendingCount || 0;
  } catch (e) {
    console.warn('Failed to sync widget quick adds:', e);
    return 0;
  }
}
