/**
 * Hydration utility functions
 */

/**
 * Get a greeting based on the current time of day.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Format milliliters to a human-readable string.
 * e.g., 1500 → "1.5 L", 250 → "250 ml"
 */
export function formatWater(ml: number, unit: 'ml' | 'oz' = 'ml'): string {
  if (unit === 'oz') {
    const oz = ml * 0.033814;
    return oz >= 33.814
      ? `${(oz / 33.814).toFixed(1)} L`
      : `${Math.round(oz)} oz`;
  }
  if (ml >= 1000) {
    const liters = ml / 1000;
    return `${liters % 1 === 0 ? liters.toFixed(0) : liters.toFixed(1)} L`;
  }
  return `${ml} ml`;
}

/**
 * Format milliliters to liters string (always liters).
 * e.g., 1500 → "1.5", 2000 → "2.0"
 */
export function formatLiters(ml: number): string {
  return (ml / 1000).toFixed(1);
}

/**
 * Calculate hydration progress as a percentage (0–1).
 */
export function getProgress(consumed: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(consumed / goal, 1);
}

/**
 * Get minutes since a given timestamp.
 */
export function minutesSince(timestamp: number): number {
  return Math.floor((Date.now() - timestamp) / (1000 * 60));
}

/**
 * Format a date to a time string (e.g., "10:30 AM").
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get the next reminder time based on interval.
 */
export function getNextReminderTime(
  lastDrinkTime: number,
  intervalMinutes: number
): Date {
  const next = new Date(lastDrinkTime + intervalMinutes * 60 * 1000);
  // If the next reminder is in the past, calculate from now
  if (next.getTime() < Date.now()) {
    return new Date(Date.now() + intervalMinutes * 60 * 1000);
  }
  return next;
}

/**
 * Get a relative time string (e.g., "In 18 minutes").
 */
export function getRelativeTime(futureDate: Date): string {
  const diffMs = futureDate.getTime() - Date.now();
  if (diffMs <= 0) return 'Now';

  const diffMin = Math.floor(diffMs / (1000 * 60));
  if (diffMin < 1) return 'Less than a minute';
  if (diffMin === 1) return 'In 1 minute';
  if (diffMin < 60) return `In ${diffMin} minutes`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return 'In 1 hour';
  return `In ${diffHours} hours`;
}

/**
 * Get today's date key (YYYY-MM-DD) for storage.
 */
export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Get the date key for N days ago.
 */
export function getDateKey(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Get the short day name from a date key.
 */
export function getDayName(dateKey: string): string {
  const d = new Date(dateKey + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}
