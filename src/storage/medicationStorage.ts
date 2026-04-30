import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants/data';
import {ActivityItem, Medicine, UserProfile} from '../types/medication';

export async function loadPersistedData() {
  const [savedMeds, savedActivity, savedProfile] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.MEDICINES),
    AsyncStorage.getItem(STORAGE_KEYS.ACTIVITY),
    AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
  ]);

  return {
    medicines: savedMeds ? (JSON.parse(savedMeds) as Medicine[]) : [],
    activity: savedActivity ? (JSON.parse(savedActivity) as ActivityItem[]) : [],
    profile: savedProfile ? (JSON.parse(savedProfile) as UserProfile) : null,
  };
}

export async function persistMedicines(medicines: Medicine[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
}

export async function persistActivity(activity: ActivityItem[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
}

export async function persistProfile(profile: UserProfile) {
  await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}
