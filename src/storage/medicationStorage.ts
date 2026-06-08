import { ActivityItem, Medicine, UserProfile } from '../types/medication';
import { EMPTY_MEDICINE_FORM } from '../constants/data';
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

async function ensureUserDocument() {
  await setDoc(
    userDocRef(),
    { updatedAt: new Date().toISOString() },
    { merge: true },
  );
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

export async function loadPersistedData() {
  const [medicinesSnapshot, activitySnapshot, profileSnapshot] =
    await Promise.all([
      getDocs(query(medicinesCollectionRef(), orderBy('createdAt', 'desc'))),
      getDocs(query(activityCollectionRef(), orderBy('date', 'desc'))),
      getDoc(profileDocRef()),
    ]);

  return {
    medicines: medicinesSnapshot.docs.map(item => {
      const data = item.data() as Medicine;
      return {
        ...data,
        medicineType: data.medicineType || EMPTY_MEDICINE_FORM.medicineType,
        unit: data.unit || EMPTY_MEDICINE_FORM.unit,
        foodInstruction:
          data.foodInstruction || EMPTY_MEDICINE_FORM.foodInstruction,
        alarmEnabled:
          typeof data.alarmEnabled === 'boolean'
            ? data.alarmEnabled
            : EMPTY_MEDICINE_FORM.alarmEnabled,
        alarmSound: data.alarmSound || EMPTY_MEDICINE_FORM.alarmSound,
        snoozeMinutes: data.snoozeMinutes || EMPTY_MEDICINE_FORM.snoozeMinutes,
      };
    }),
    activity: activitySnapshot.docs.map(item => item.data() as ActivityItem),
    profile: profileSnapshot.exists()
      ? (profileSnapshot.data() as UserProfile)
      : undefined,
  };
}

export async function persistMedicines(medicines: Medicine[]) {
  await syncCollection(medicinesCollectionRef(), medicines);
}

export async function persistActivity(activity: ActivityItem[]) {
  await syncCollection(activityCollectionRef(), activity);
}

export async function persistProfile(profile: UserProfile) {
  await ensureUserDocument();
  await setDoc(profileDocRef(), profile);
}
