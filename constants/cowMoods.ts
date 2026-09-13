/**
 * Cow Mood System
 *
 * The cow's mood is the primary feedback mechanism.
 * No badges, XP, or gamification — just a charming companion.
 */

export type CowMood = 'happy' | 'reminder' | 'tired' | 'dehydrated' | 'goalComplete';

export interface CowMoodConfig {
  mood: CowMood;
  label: string;
  message: string;
  emoji: string;
  color: string;
}

export const COW_MOODS: Record<CowMood, CowMoodConfig> = {
  happy: {
    mood: 'happy',
    label: 'Happy',
    message: "You're doing great! Keep it up! 💧",
    emoji: '😊',
    color: '#4CAF50',
  },
  reminder: {
    mood: 'reminder',
    label: 'Thirsty',
    message: "Time for a drink! I'm a little thirsty.",
    emoji: '🥛',
    color: '#4A9FD8',
  },
  tired: {
    mood: 'tired',
    label: 'Tired',
    message: "I'm getting a bit tired... some water would help!",
    emoji: '😴',
    color: '#FF9800',
  },
  dehydrated: {
    mood: 'dehydrated',
    label: 'Dehydrated',
    message: "I really need some water... please drink up!",
    emoji: '😢',
    color: '#F44336',
  },
  goalComplete: {
    mood: 'goalComplete',
    label: 'Refreshed',
    message: "Amazing! Daily goal complete! Moo! 🎉",
    emoji: '🤩',
    color: '#2E7D32',
  },
};

/**
 * Determine cow mood based on hydration progress and time context.
 *
 * @param consumed - Water consumed today (ml)
 * @param goal - Daily goal (ml)
 * @param minutesSinceLastDrink - Minutes since last water entry
 * @param reminderInterval - Reminder interval in minutes
 */
export function calculateCowMood(
  consumed: number,
  goal: number,
  minutesSinceLastDrink: number,
  reminderInterval: number = 60
): CowMood {
  const progress = goal > 0 ? consumed / goal : 0;

  // Goal complete!
  if (progress >= 1) {
    return 'goalComplete';
  }

  // Dehydrated — ignored reminders for a long time (3x interval)
  if (minutesSinceLastDrink > reminderInterval * 3 && progress < 0.5) {
    return 'dehydrated';
  }

  // Tired — falling behind (2x interval without drinking)
  if (minutesSinceLastDrink > reminderInterval * 2) {
    return 'tired';
  }

  // Reminder — it's time to drink (past 1 interval)
  if (minutesSinceLastDrink > reminderInterval) {
    return 'reminder';
  }

  // Happy — on track
  return 'happy';
}
