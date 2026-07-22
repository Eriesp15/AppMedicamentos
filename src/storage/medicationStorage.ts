import { ActivityItem, Medicine, MedicationSuggestion, UserProfile } from '../types/medication';
import {
  CATALOG_STORAGE_KEY,
  DEFAULT_PROFILE,
  EMPTY_MEDICINE_FORM,
  MEDICATION_DATABASE,
  userStorageKeys,
} from '../constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

const OFFLINE_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('offline-timeout')), ms),
    ),
  ]);
}

// React Native Firebase auto-initialises from google-services.json; we
// lazily obtain the Firestore instance so it's guaranteed to be ready
// regardless of module load order.
let _firestoreDb: FirebaseFirestoreTypes.Module | null = null;
function firestoreDb(): FirebaseFirestoreTypes.Module {
  if (!_firestoreDb) {
    _firestoreDb = firestore();
  }
  return _firestoreDb;
}

// Las rutas de Firestore están namespaced por UID: `appUsers/{uid}/...`.
// Cada cuenta autenticada tiene su propio espacio; dos cuentas distintas
// no ven ni pisan los medicamentos del otro.
const USER_COLLECTION = 'appUsers';
const PROFILE_DOCUMENT_ID = 'main';

// Antes de la introducción de autenticación, la app guardaba todos los
// datos bajo `appUsers/defaultUser/...` y en claves AsyncStorage
// globales (`@medicare/medicines`, etc.). Para no perder esos datos al
// actualizar, `migrateLegacyData` los mueve al namespace del UID cuando
// el usuario inicia sesión por primera vez.
//
// NOTA: Antiguamente también intentábamos drenar `defaultUser` desde
// Firestore, pero las reglas de seguridad típicas sólo permiten al
// dueño leer su propio namespace (`request.auth.uid == userId`), por
// lo que esa lectura siempre devolvía `permission-denied` para
// cualquier usuario real y provocaba un bucle de errores en cada
// arranque. La rama Firestore legacy se eliminó por completo: queda
// en manos de un eventual job de admin.
const LEGACY_STORAGE_KEYS = {
  MEDICINES: '@medicare/medicines',
  ACTIVITY: '@medicare/activity',
  PROFILE: '@medicare/profile',
};

function requireUserId(userId: string | null | undefined): string {
  if (!userId) {
    throw new Error('Operación de almacenamiento requiere un usuario autenticado.');
  }
  return userId;
}

const userDocRef = (userId: string) =>
  firestoreDb().collection(USER_COLLECTION).doc(requireUserId(userId));
const medicinesCollectionRef = (userId: string) =>
  userDocRef(userId).collection('medicines');
const activityCollectionRef = (userId: string) =>
  userDocRef(userId).collection('activity');
const profileDocRef = (userId: string) =>
  userDocRef(userId).collection('profile').doc(PROFILE_DOCUMENT_ID);

type PersistedData = {
  medicines: Medicine[];
  activity: ActivityItem[];
  profile?: UserProfile;
};

/**
 * Garantiza que el documento del usuario exista en Firestore y, si todavía
 * no tiene perfil, crea uno con los valores por defecto vinculados al UID.
 * Se invoca en el primer login del usuario. Es idempotente: si los docs
 * ya existen, solo asegura `updatedAt`.
 */
export async function ensureUserDocument(userId: string): Promise<void> {
  const uid = requireUserId(userId);
  const userRef = firestoreDb().collection(USER_COLLECTION).doc(uid);
  const profileRef = userRef.collection('profile').doc(PROFILE_DOCUMENT_ID);

  await withTimeout(
    userRef.set(
      {
        uid,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    ),
    OFFLINE_TIMEOUT_MS,
  );

  const existingProfile = await withTimeout(profileRef.get(), OFFLINE_TIMEOUT_MS);
  if (!existingProfile.exists) {
    await withTimeout(
      profileRef.set({
        ...DEFAULT_PROFILE,
        uid,
        createdAt: new Date().toISOString(),
      }),
      OFFLINE_TIMEOUT_MS,
    );
  }
}

/**
 * Migración única: copia datos preexistentes del esquema anterior al
 * namespace del usuario autenticado. Antes de la introducción de
 * autenticación, la app escribía en `appUsers/defaultUser/...` y en
 * claves AsyncStorage globales (`@medicare/medicines`, etc.). Para no
 * perder esos datos al actualizar, los movemos al namespace del UID
 * cuando el usuario inicia sesión por primera vez y luego borramos las
 * claves legacy. Es idempotente y best-effort — un fallo en AsyncStorage
 * no debe impedir el flujo normal.
 *
 * Se marca con un flag por usuario en AsyncStorage para no repetir las
 * lecturas legacy en cada arranque.
 *
 * Antes intentábamos también drenar `appUsers/defaultUser` desde
 * Firestore, pero las reglas de seguridad típicas sólo permiten al
 * dueño leer su propio namespace (`request.auth.uid == userId`), por
 * lo que esa lectura siempre devolvía `permission-denied` y provocaba
 * un bucle de errores en cada login. Lo eliminamos por completo.
 */
const MIGRATION_FLAG_KEY = (uid: string) => `@medicare/${uid}/_migratedLegacy`;

export async function migrateLegacyData(userId: string): Promise<void> {
  if (!userId) {
    return;
  }
  const targetKeys = userStorageKeys(userId);

  // Si este usuario ya terminó la migración, sólo necesitamos asegurar
  // que las claves legacy globales no vuelvan a aparecer (defensa contra
  // reinstalaciones que restauraron la copia de seguridad).
  if (await AsyncStorage.getItem(MIGRATION_FLAG_KEY(userId))) {
    await AsyncStorage.multiRemove([
      LEGACY_STORAGE_KEYS.MEDICINES,
      LEGACY_STORAGE_KEYS.ACTIVITY,
      LEGACY_STORAGE_KEYS.PROFILE,
    ]).catch(() => {});
    return;
  }

  try {
    const [legacyEntries, targetEntries] = await Promise.all([
      AsyncStorage.multiGet([
        LEGACY_STORAGE_KEYS.MEDICINES,
        LEGACY_STORAGE_KEYS.ACTIVITY,
        LEGACY_STORAGE_KEYS.PROFILE,
      ]),
      AsyncStorage.multiGet([
        targetKeys.MEDICINES,
        targetKeys.ACTIVITY,
        targetKeys.PROFILE,
      ]),
    ]);

    const legacyValues = Object.fromEntries(legacyEntries);
    const targetValues = Object.fromEntries(targetEntries);

    const writes: [string, string][] = [];
    const removals: string[] = [];
    if (
      legacyValues[LEGACY_STORAGE_KEYS.MEDICINES] &&
      !targetValues[targetKeys.MEDICINES]
    ) {
      writes.push([
        targetKeys.MEDICINES,
        legacyValues[LEGACY_STORAGE_KEYS.MEDICINES] as string,
      ]);
      removals.push(LEGACY_STORAGE_KEYS.MEDICINES);
    }
    if (
      legacyValues[LEGACY_STORAGE_KEYS.ACTIVITY] &&
      !targetValues[targetKeys.ACTIVITY]
    ) {
      writes.push([
        targetKeys.ACTIVITY,
        legacyValues[LEGACY_STORAGE_KEYS.ACTIVITY] as string,
      ]);
      removals.push(LEGACY_STORAGE_KEYS.ACTIVITY);
    }
    if (
      legacyValues[LEGACY_STORAGE_KEYS.PROFILE] &&
      !targetValues[targetKeys.PROFILE]
    ) {
      writes.push([
        targetKeys.PROFILE,
        legacyValues[LEGACY_STORAGE_KEYS.PROFILE] as string,
      ]);
      removals.push(LEGACY_STORAGE_KEYS.PROFILE);
    }

    if (writes.length) {
      await AsyncStorage.multiSet(writes);
    }
    if (removals.length) {
      await AsyncStorage.multiRemove(removals);
    }
  } catch {
    // Migración best-effort: si AsyncStorage falla, seguimos cargando en
    // vacío antes que bloquear el arranque.
  }

  // Marcamos la migración como completada PARA ESTE USUARIO siempre,
  // incluso si AsyncStorage falló: repetirla en cada arranque sólo
  // produciría churn sin sentido.
  await AsyncStorage.setItem(
    MIGRATION_FLAG_KEY(userId),
    new Date().toISOString(),
  ).catch(() => {});
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
    frequency: typeof data.frequency === 'number' ? data.frequency : 8,
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

/**
 * Carga los datos en caché del usuario desde AsyncStorage. Si no hay
 * `userId`, devuelve un estado vacío (no debe usarse antes del login).
 */
export async function loadLocalData(userId: string | null): Promise<PersistedData> {
  if (!userId) {
    return { medicines: [], activity: [], profile: undefined };
  }
  const keys = userStorageKeys(userId);
  const entries = await AsyncStorage.multiGet([
    keys.MEDICINES,
    keys.ACTIVITY,
    keys.PROFILE,
  ]);
  const values = Object.fromEntries(entries);
  const medicines = parseJson<Medicine[]>(values[keys.MEDICINES], []);
  const activity = parseJson<ActivityItem[]>(values[keys.ACTIVITY], []);
  const profile = parseJson<UserProfile | undefined>(
    values[keys.PROFILE],
    undefined,
  );

  return {
    medicines: medicines.map(normalizeMedicine),
    activity,
    profile,
  };
}

/**
 * Persiste en AsyncStorage bajo las claves del usuario. Escribe tal cual
 * lo que le pasen: si `data.medicines` viene como `[]`, lo escribe y
 * respeta la decisión del usuario (p. ej. borrar todos los medicamentos).
 * Las decisiones de "no pisar la caché local con un merge vacío" se
 * toman en la capa superior (`loadPersistedData`), no aquí.
 */
export async function persistLocalData(
  userId: string | null,
  data: Partial<PersistedData>,
) {
  if (!userId) {
    return;
  }
  const keys = userStorageKeys(userId);
  const writes: [string, string][] = [];

  if (data.medicines) {
    writes.push([keys.MEDICINES, JSON.stringify(data.medicines)]);
  }
  if (data.activity) {
    writes.push([keys.ACTIVITY, JSON.stringify(data.activity)]);
  }
  if (data.profile) {
    writes.push([keys.PROFILE, JSON.stringify(data.profile)]);
  }

  if (writes.length) {
    await AsyncStorage.multiSet(writes);
  }
}

async function syncCollection<T extends { id: string }>(
  collectionRef: ReturnType<typeof medicinesCollectionRef>,
  items: T[],
  userId: string,
) {
  try {
    await ensureUserDocument(userId);
    await Promise.all(
      items.map(item =>
        withTimeout(collectionRef.doc(item.id).set(item), OFFLINE_TIMEOUT_MS),
      ),
    );
  } catch {
    // Offline: data is already saved locally via persistLocalData
  }
}

export async function deleteMedicinesFromFirestore(
  userId: string | null,
  ids: string[],
) {
  if (!userId) {
    return;
  }
  const ref = medicinesCollectionRef(userId);
  try {
    await Promise.all(
      ids.map(id => withTimeout(ref.doc(id).delete(), OFFLINE_TIMEOUT_MS)),
    );
  } catch {
    // Offline: deletion will be handled by Firestore when back online
  }
}

export async function deleteActivitiesFromFirestore(
  userId: string | null,
  ids: string[],
) {
  if (!userId) {
    return;
  }
  const ref = activityCollectionRef(userId);
  try {
    await Promise.all(
      ids.map(id => withTimeout(ref.doc(id).delete(), OFFLINE_TIMEOUT_MS)),
    );
  } catch {
    // Offline: deletion will be handled by Firestore when back online
  }
}

async function loadRemoteData(userId: string): Promise<PersistedData> {
  const [medicinesSnapshot, activitySnapshot, profileSnapshot] =
    await Promise.all([
      withTimeout(
        medicinesCollectionRef(userId).orderBy('createdAt', 'desc').get(),
        OFFLINE_TIMEOUT_MS,
      ),
      withTimeout(
        activityCollectionRef(userId).orderBy('date', 'desc').get(),
        OFFLINE_TIMEOUT_MS,
      ),
      withTimeout(
        profileDocRef(userId).get(),
        OFFLINE_TIMEOUT_MS,
      ),
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

/**
 * Une caché local con los datos remotos del usuario. Si el usuario no
 * está autenticado, devuelve únicamente lo que haya en AsyncStorage sin
 * intentar hablar con Firestore. Antes de cargar, ejecuta una migración
 * única de datos legacy bajo `defaultUser` para no perder el cache de
 * usuarios que usaron la app antes de la autenticación.
 *
 * Importante: si `merged` queda completamente vacío (sin medicinas,
 * actividad y sin perfil) NO escribimos de vuelta la caché, porque en
 * ese escenario estamos ante un primer arranque del usuario y no
 * queremos barrer su caché local previa.
 */
export async function loadPersistedData(
  userId: string | null,
): Promise<PersistedData> {
  const localData = await loadLocalData(userId);

  if (!userId) {
    return localData;
  }

  await migrateLegacyData(userId).catch(() => {});

  try {
    await ensureUserDocument(userId).catch(() => {});
    const remoteData = await loadRemoteData(userId);
    const merged = mergeData(localData, remoteData);
    const hasMergedContent =
      merged.medicines.length > 0 ||
      merged.activity.length > 0 ||
      merged.profile != null;
    if (hasMergedContent) {
      await persistLocalData(userId, merged);
    }
    return merged;
  } catch {
    return localData;
  }
}

export async function mergeRemoteMedicines(
  userId: string | null,
  remoteMedicines: Medicine[],
) {
  const local = await loadLocalData(userId);
  const remoteIds = new Set(remoteMedicines.map(m => m.id));

  const merged = [
    ...(local.medicines ?? []).filter(m => !remoteIds.has(m.id)),
    ...remoteMedicines,
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  await persistLocalData(userId, { medicines: merged });
  return merged;
}

export async function mergeRemoteActivity(
  userId: string | null,
  remoteActivity: ActivityItem[],
) {
  const local = await loadLocalData(userId);
  const remoteIds = new Set(remoteActivity.map(a => a.id));

  const merged = [
    ...(local.activity ?? []).filter(a => !remoteIds.has(a.id)),
    ...remoteActivity,
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  await persistLocalData(userId, { activity: merged });
  return merged;
}

export async function persistMedicines(
  userId: string | null,
  medicines: Medicine[],
) {
  await persistLocalData(userId, { medicines });
  if (!userId) {
    return;
  }
  await syncCollection(medicinesCollectionRef(userId), medicines, userId);
}

export async function persistActivity(
  userId: string | null,
  activity: ActivityItem[],
) {
  await persistLocalData(userId, { activity });
  if (!userId) {
    return;
  }
  await syncCollection(activityCollectionRef(userId), activity, userId);
}

export async function persistProfile(
  userId: string | null,
  profile: UserProfile,
) {
  await persistLocalData(userId, { profile });
  if (!userId) {
    return;
  }
  try {
    await ensureUserDocument(userId);
    await withTimeout(profileDocRef(userId).set(profile), OFFLINE_TIMEOUT_MS);
  } catch {
    // Offline: profile is already saved locally via persistLocalData
  }
}

export async function persistProfilePhoto(
  userId: string | null,
  photo: string,
) {
  if (!userId) {
    return;
  }
  const keys = userStorageKeys(userId);
  const existingRaw = await AsyncStorage.getItem(keys.PROFILE);
  const existing = existingRaw ? (JSON.parse(existingRaw) as UserProfile) : DEFAULT_PROFILE;
  const updated: UserProfile = { ...existing, photo };
  await AsyncStorage.setItem(keys.PROFILE, JSON.stringify(updated));
  try {
    await ensureUserDocument(userId);
    await withTimeout(
      profileDocRef(userId).set({ photo }, { merge: true }),
      OFFLINE_TIMEOUT_MS,
    );
  } catch {
    // Offline: photo is already saved locally via AsyncStorage
  }
}

export function subscribeToMedicines(
  userId: string | null,
  onUpdate: (medicines: Medicine[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!userId) {
    return () => {};
  }
  return medicinesCollectionRef(userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        const medicines = snapshot.docs.map(d =>
          normalizeMedicine(d.data() as Medicine),
        );
        onUpdate(medicines);
      },
      onError,
    );
}

export async function seedMedicationCatalogIfEmpty(
  _userId: string | null,
): Promise<MedicationSuggestion[]> {
  // El catálogo es contenido estático que se envía con la app. Sólo lo
  // mantenemos en AsyncStorage para permitir overrides manuales en el
  // futuro (p. ej. desde un panel admin). No hay versión remota: antes
  // intentábamos sincronizarlo bajo `appUsers/_shared/medicationCatalog`,
  // pero las reglas de seguridad típicas del esquema (`request.auth.uid
  // == userId`) niegan el acceso a cualquier UID distinto a `_shared`,
  // lo que disparaba `permission-denied` cada vez que la app abría y
  // se acumulaba en el toast de error.
  try {
    const local = await AsyncStorage.getItem(CATALOG_STORAGE_KEY);
    if (local) {
      return JSON.parse(local) as MedicationSuggestion[];
    }
    await AsyncStorage.setItem(
      CATALOG_STORAGE_KEY,
      JSON.stringify(MEDICATION_DATABASE),
    );
    return MEDICATION_DATABASE;
  } catch {
    return MEDICATION_DATABASE;
  }
}

export function subscribeToActivity(
  userId: string | null,
  onUpdate: (activity: ActivityItem[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!userId) {
    return () => {};
  }
  return activityCollectionRef(userId)
    .orderBy('date', 'desc')
    .onSnapshot(
      snapshot => {
        const items = snapshot.docs.map(d => d.data() as ActivityItem);
        onUpdate(items);
      },
      onError,
    );
}
