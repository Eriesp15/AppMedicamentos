import { ActivityItem, Medicine, MedicationSuggestion, UserProfile } from '../types/medication';
import { EMPTY_MEDICINE_FORM, MEDICATION_DATABASE, STORAGE_KEYS } from '../constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestoreDb } from '../config/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';

const USER_DOCUMENT_ID = 'defaultUser';
const USER_COLLECTION = 'appUsers';
const PROFILE_DOCUMENT_ID = 'main';

const userDocRef = () => doc(firestoreDb, USER_COLLECTION, USER_DOCUMENT_ID);
const medicinesCollectionRef = () => collection(userDocRef(), 'medicines');
const activityCollectionRef = () => collection(userDocRef(), 'activity');
const profileDocRef = () => doc(userDocRef(), 'profile', PROFILE_DOCUMENT_ID);
const catalogCollectionRef = () => collection(userDocRef(), 'medicationCatalog');

type PersistedData = {
  medicines: Medicine[];
  activity: ActivityItem[];
  profile?: UserProfile;
};

async function ensureUserDocument() {
  await setDoc(
    userDocRef(),
    { updatedAt: new Date().toISOString() },
    { merge: true },
  );
}

function normalizeMedicine(data: Medicine): Medicine {
  return {
    ...data,
    medicineType: data.medicineType || EMPTY_MEDICINE_FORM.medicineType,
    unit: data.unit || EMPTY_MEDICINE_FORM.unit,
    foodInstruction: data.foodInstruction || EMPTY_MEDICINE_FORM.foodInstruction,
    alarmEnabled:
      typeof data.alarmEnabled === 'boolean'
        ? data.alarmEnabled
        : EMPTY_MEDICINE_FORM.alarmEnabled,
    alarmSound: data.alarmSound || EMPTY_MEDICINE_FORM.alarmSound,
    snoozeMinutes: data.snoozeMinutes || EMPTY_MEDICINE_FORM.snoozeMinutes,
    active:
      typeof data.active === 'boolean' ? data.active : true,
  };
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function loadLocalData(): Promise<PersistedData> {
  const entries = await AsyncStorage.multiGet([
    STORAGE_KEYS.MEDICINES,
    STORAGE_KEYS.ACTIVITY,
    STORAGE_KEYS.PROFILE,
  ]);
  const values = Object.fromEntries(entries);
  const medicines = parseJson<Medicine[]>(values[STORAGE_KEYS.MEDICINES], []);
  const activity = parseJson<ActivityItem[]>(values[STORAGE_KEYS.ACTIVITY], []);
  const profile = parseJson<UserProfile | undefined>(
    values[STORAGE_KEYS.PROFILE],
    undefined,
  );

  return {
    medicines: medicines.map(normalizeMedicine),
    activity,
    profile,
  };
}

export async function persistLocalData(data: Partial<PersistedData>) {
  const writes: [string, string][] = [];

  if (data.medicines) {
    writes.push([STORAGE_KEYS.MEDICINES, JSON.stringify(data.medicines)]);
  }
  if (data.activity) {
    writes.push([STORAGE_KEYS.ACTIVITY, JSON.stringify(data.activity)]);
  }
  if (data.profile) {
    writes.push([STORAGE_KEYS.PROFILE, JSON.stringify(data.profile)]);
  }

  if (writes.length) {
    await AsyncStorage.multiSet(writes);
  }
}

async function syncCollection<T extends { id: string }>(
  collectionRef: ReturnType<typeof medicinesCollectionRef>,
  items: T[],
) {
  await ensureUserDocument();

  await Promise.all(
    items.map(item => setDoc(doc(collectionRef, item.id), item).catch(() => {})),
  );
}

export async function deleteMedicinesFromFirestore(ids: string[]) {
  const ref = medicinesCollectionRef();
  await Promise.all(
    ids.map(id => deleteDoc(doc(ref, id)).catch(() => {})),
  );
}

export async function deleteActivitiesFromFirestore(ids: string[]) {
  const ref = activityCollectionRef();
  await Promise.all(
    ids.map(id => deleteDoc(doc(ref, id)).catch(() => {})),
  );
}

async function loadRemoteData(): Promise<PersistedData> {
  const [medicinesSnapshot, activitySnapshot, profileSnapshot] =
    await Promise.all([
      getDocs(query(medicinesCollectionRef(), orderBy('createdAt', 'desc'))),
      getDocs(query(activityCollectionRef(), orderBy('date', 'desc'))),
      getDoc(profileDocRef()),
    ]);

  return {
    medicines: medicinesSnapshot.docs
      .map(item => item.data() as Medicine)
      .map(normalizeMedicine),
    activity: activitySnapshot.docs.map(item => item.data() as ActivityItem),
    profile: profileSnapshot.exists()
      ? (profileSnapshot.data() as UserProfile)
      : undefined,
  };
}

function mergeData(local: PersistedData, remote: PersistedData): PersistedData {
  const remoteMedIds = new Set(remote.medicines.map(m => m.id));

  const mergedMedicines = [
    ...local.medicines.filter(m => !remoteMedIds.has(m.id)),
    ...remote.medicines,
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const remoteActIds = new Set(remote.activity.map(a => a.id));

  const mergedActivity = [
    ...local.activity.filter(a => !remoteActIds.has(a.id)),
    ...remote.activity,
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return {
    medicines: mergedMedicines,
    activity: mergedActivity,
    profile: remote.profile || local.profile,
  };
}

export async function loadPersistedData() {
  const localData = await loadLocalData();

  try {
    const remoteData = await loadRemoteData();
    const merged = mergeData(localData, remoteData);
    await persistLocalData(merged);
    return merged;
  } catch {
    return localData;
  }
}

export async function mergeRemoteMedicines(remoteMedicines: Medicine[]) {
  const local = await loadLocalData();
  const remoteIds = new Set(remoteMedicines.map(m => m.id));

  const merged = [
    ...local.medicines.filter(m => !remoteIds.has(m.id)),
    ...remoteMedicines,
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  await persistLocalData({ medicines: merged });
  return merged;
}

export async function mergeRemoteActivity(remoteActivity: ActivityItem[]) {
  const local = await loadLocalData();
  const remoteIds = new Set(remoteActivity.map(a => a.id));

  const merged = [
    ...local.activity.filter(a => !remoteIds.has(a.id)),
    ...remoteActivity,
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  await persistLocalData({ activity: merged });
  return merged;
}

export async function persistMedicines(medicines: Medicine[]) {
  await persistLocalData({ medicines });
  syncCollection(medicinesCollectionRef(), medicines).catch(() => {});
}

export async function persistActivity(activity: ActivityItem[]) {
  await persistLocalData({ activity });
  syncCollection(activityCollectionRef(), activity).catch(() => {});
}

export async function persistProfile(profile: UserProfile) {
  await persistLocalData({ profile });
  ensureUserDocument()
    .then(() => setDoc(profileDocRef(), profile))
    .catch(() => {});
}

export function subscribeToMedicines(
  onUpdate: (medicines: Medicine[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(medicinesCollectionRef(), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    snapshot => {
      const medicines = snapshot.docs.map(d =>
        normalizeMedicine(d.data() as Medicine),
      );
      onUpdate(medicines);
    },
    onError,
  );
}

export const CATALOG_STORAGE_KEY = '@medicare/medicationCatalog';

export async function seedMedicationCatalogIfEmpty(): Promise<MedicationSuggestion[]> {
  try {
    const remoteSnapshot = await getDocs(catalogCollectionRef());
    if (!remoteSnapshot.empty) {
      const remote: MedicationSuggestion[] = remoteSnapshot.docs.map(
        d => d.data() as MedicationSuggestion,
      );
      await AsyncStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(remote));
      return remote;
    }
    await Promise.all(
      MEDICATION_DATABASE.map(med =>
        setDoc(doc(catalogCollectionRef(), med.name), med).catch(() => {}),
      ),
    );
    await AsyncStorage.setItem(
      CATALOG_STORAGE_KEY,
      JSON.stringify(MEDICATION_DATABASE),
    );
    return MEDICATION_DATABASE;
  } catch {
    const local = await AsyncStorage.getItem(CATALOG_STORAGE_KEY);
    if (local) {
      return JSON.parse(local) as MedicationSuggestion[];
    }
    return MEDICATION_DATABASE;
  }
}

export async function loadMedicationCatalog(): Promise<MedicationSuggestion[]> {
  try {
    const remoteSnapshot = await getDocs(catalogCollectionRef());
    if (!remoteSnapshot.empty) {
      const remote: MedicationSuggestion[] = remoteSnapshot.docs.map(
        d => d.data() as MedicationSuggestion,
      );
      await AsyncStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(remote));
      return remote;
    }
  } catch {}
  const local = await AsyncStorage.getItem(CATALOG_STORAGE_KEY);
  if (local) {
    return JSON.parse(local) as MedicationSuggestion[];
  }
  return [];
}

export function subscribeToMedicationCatalog(
  onUpdate: (catalog: MedicationSuggestion[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    catalogCollectionRef(),
    snapshot => {
      const catalog = snapshot.docs.map(d => d.data() as MedicationSuggestion);
      onUpdate(catalog);
      AsyncStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog)).catch(() => {});
    },
    onError,
  );
}

export function subscribeToActivity(
  onUpdate: (activity: ActivityItem[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(activityCollectionRef(), orderBy('date', 'desc'));
  return onSnapshot(
    q,
    snapshot => {
      const items = snapshot.docs.map(d => d.data() as ActivityItem);
      onUpdate(items);
    },
    onError,
  );
}
