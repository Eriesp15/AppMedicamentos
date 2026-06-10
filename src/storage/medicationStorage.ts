import { ActivityItem, Medicine, UserProfile } from '../types/medication';
import { EMPTY_MEDICINE_FORM, STORAGE_KEYS } from '../constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestoreDb } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore';

const USER_DOCUMENT_ID = 'defaultUser';
const USER_COLLECTION = 'appUsers';
const PROFILE_DOCUMENT_ID = 'main';

const userDocRef = () => doc(firestoreDb, USER_COLLECTION, USER_DOCUMENT_ID);
const medicinesCollectionRef = () => collection(userDocRef(), 'medicines');
const activityCollectionRef = () => collection(userDocRef(), 'activity');
const profileDocRef = () => doc(userDocRef(), 'profile', PROFILE_DOCUMENT_ID);

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

async function loadLocalData(): Promise<PersistedData> {
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

async function persistLocalData(data: Partial<PersistedData>) {
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

  const batch = writeBatch(firestoreDb);
  const snapshot = await getDocs(collectionRef);
  const incomingIds = new Set(items.map(item => item.id));

  snapshot.docs.forEach(item => {
    if (!incomingIds.has(item.id)) {
      batch.delete(item.ref);
    }
  });

  items.forEach(item => {
    batch.set(doc(collectionRef, item.id), item);
  });

  await batch.commit();
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

function hasLocalData(data: PersistedData) {
  return Boolean(data.medicines.length || data.activity.length || data.profile);
}

export async function loadPersistedData() {
  const localData = await loadLocalData();

  if (hasLocalData(localData)) {
    return localData;
  }

  try {
    const remoteData = await loadRemoteData();
    await persistLocalData(remoteData);
    return remoteData;
  } catch {
    return localData;
  }
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
