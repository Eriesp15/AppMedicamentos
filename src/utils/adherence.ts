import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from '../types/medication';

const ACTIVITY_KEY = 'app_activity';

export async function calculateAdherence(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(ACTIVITY_KEY);
    const activities: Activity[] = data ? JSON.parse(data) : [];

    if (activities.length === 0) return 0;

    const takenCount = activities.filter((a) => a.taken).length;
    return (takenCount / activities.length) * 100;
  } catch (error) {
    console.error('Error calculating adherence:', error);
    return 0;
  }
}

export async function calculateWeeklyAdherence(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(ACTIVITY_KEY);
    const activities: Activity[] = data ? JSON.parse(data) : [];

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekActivities = activities.filter((a) => {
      const actDate = new Date(a.date);
      return actDate >= weekAgo && actDate <= now;
    });

    if (weekActivities.length === 0) return 0;

    const takenCount = weekActivities.filter((a) => a.taken).length;
    return (takenCount / weekActivities.length) * 100;
  } catch (error) {
    console.error('Error calculating weekly adherence:', error);
    return 0;
  }
}

export async function getTodayStats() {
  try {
    const data = await AsyncStorage.getItem(ACTIVITY_KEY);
    const activities: Activity[] = data ? JSON.parse(data) : [];

    const today = new Date().toDateString();
    const todayActivities = activities.filter(
      (a) => new Date(a.date).toDateString() === today
    );

    const taken = todayActivities.filter((a) => a.taken).length;
    const total = todayActivities.length;

    return {
      taken,
      total,
      percentage: total > 0 ? (taken / total) * 100 : 0,
    };
  } catch (error) {
    console.error('Error getting today stats:', error);
    return { taken: 0, total: 0, percentage: 0 };
  }
}
