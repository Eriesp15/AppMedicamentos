import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { DEFAULT_PROFILE, EMPTY_MEDICINE_FORM } from '../constants/data';
import { useAppSettings } from '../context/AppSettingsContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  cancelMedicineAlarms,
  scheduleAllMedicineAlarms,
} from '../services/alarmService';
import {
  ActivityItem,
  AlarmSoundId,
  AppTab,
  MedicationSuggestion,
  Medicine,
  MedicineForm,
  SnoozeMinutes,
  UserProfile,
} from '../types/medication';
import {
  deleteMedicinesFromFirestore,
  loadPersistedData,
  mergeRemoteActivity,
  persistActivity,
  persistLocalData,
  persistMedicines,
  persistProfile,
  seedMedicationCatalogIfEmpty,
  subscribeToActivity,
  subscribeToMedicines,
} from '../storage/medicationStorage';
import {
  normalizeTime,
  sanitizeDecimal,
  sanitizeMedicineName,
  sanitizeNotes,
} from '../utils/inputSanitizers';

export function useMedicationManager() {
  const { settings } = useAppSettings();
  const { handleError } = useToast();
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(
    null,
  );
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date());

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [form, setForm] = useState<MedicineForm>(EMPTY_MEDICINE_FORM);
  const [medicationCatalog, setMedicationCatalog] = useState<MedicationSuggestion[]>([]);
  const [hasLoadedPersistedData, setHasLoadedPersistedData] = useState(false);

  const medicinesUnsubscribe = useRef<(() => void) | null>(null);
  const activityUnsubscribe = useRef<(() => void) | null>(null);
  const pendingDeleteIds = useRef<Set<string>>(new Set());
  const schedulingGeneration = useRef(0);
  const syncingMedicinesFromRemote = useRef(false);
  const syncingActivityFromRemote = useRef(false);

  // Reset visible state when the authenticated user changes so two accounts
  // en el mismo dispositivo no ven los medicamentos del otro mientras se
  // carga la caché del usuario recién activo.
  useEffect(() => {
    setMedicines([]);
    setActivity([]);
    setProfile(DEFAULT_PROFILE);
    setMedicationCatalog([]);
    setHasLoadedPersistedData(false);
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        // `loadPersistedData` ya invoca `ensureUserDocument` y la migración
        // de datos legacy una sola vez por usuario; aquí sólo necesitamos
        // pintar el resultado en pantalla.
        const data = await loadPersistedData(userId);
        if (cancelled) {
          return;
        }
        setMedicines(data.medicines);
        setActivity(data.activity);
        if (data.profile) {
          setProfile(data.profile);
        }
        const catalog = await seedMedicationCatalogIfEmpty(userId);
        if (cancelled) {
          return;
        }
        setMedicationCatalog(catalog);
      } catch (err) {
        // `loadPersistedData` ya absorbe errores remotos internamente y
        // devuelve los datos locales; solo entra aquí cuando AsyncStorage
        // tampoco puede leer — es un fallo crítico.
        handleError(err, 'useMedicationManager', {
          context: 'loadPersistedData',
          alertMessage:
            'No pudimos leer tu información guardada. Reinicia la app o vuelve a iniciar sesión.',
          toastMessage:
            'No se pudo leer la información local del dispositivo.',
        });
      } finally {
        if (!cancelled) {
          setHasLoadedPersistedData(true);
        }
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [handleError, userId]);

  useEffect(() => {
    if (!hasLoadedPersistedData || !userId) {
      return;
    }

    medicinesUnsubscribe.current = subscribeToMedicines(
      userId,
      async remoteMedicines => {
        const filtered = remoteMedicines.filter(
          m => !pendingDeleteIds.current.has(m.id),
        );
        syncingMedicinesFromRemote.current = true;
        setMedicines(current => {
          const remoteIds = new Set(filtered.map(m => m.id));
          const localOnly = current.filter(
            m => !remoteIds.has(m.id) && !pendingDeleteIds.current.has(m.id),
          );
          return [
            ...localOnly,
            ...filtered,
          ].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        });
        persistLocalData(userId, { medicines: filtered }).finally(() => {
          syncingMedicinesFromRemote.current = false;
        });
      },
      err => {
        handleError(err, 'useMedicationManager', {
          context: 'subscribeToMedicines',
          toastMessage:
            'Conexión con la nube interrumpida. Trabajando con datos locales.',
        });
      },
    );

    activityUnsubscribe.current = subscribeToActivity(
      userId,
      async remoteActivity => {
        try {
          syncingActivityFromRemote.current = true;
          const merged = await mergeRemoteActivity(userId, remoteActivity);
          setActivity(merged);
          syncingActivityFromRemote.current = false;
        } catch (err) {
          syncingActivityFromRemote.current = false;
          handleError(err, 'useMedicationManager', {
            context: 'mergeRemoteActivity',
          });
        }
      },
      err => {
        handleError(err, 'useMedicationManager', {
          context: 'subscribeToActivity',
          toastMessage:
            'Conexión con la nube interrumpida para el historial.',
        });
      },
    );

    return () => {
      if (medicinesUnsubscribe.current) {
        medicinesUnsubscribe.current();
      }
      if (activityUnsubscribe.current) {
        activityUnsubscribe.current();
      }
    };
  }, [handleError, hasLoadedPersistedData, userId]);

  useEffect(() => {
    if (!hasLoadedPersistedData || !userId || syncingMedicinesFromRemote.current) {
      return;
    }
    persistMedicines(userId, medicines).catch(err => {
      handleError(err, 'useMedicationManager', {
        context: 'persistMedicines',
        toastMessage:
          'No se pudo guardar la lista de medicamentos en la nube.',
      });
    });
  }, [handleError, hasLoadedPersistedData, medicines, userId]);

  useEffect(() => {
    if (!hasLoadedPersistedData || !userId || syncingActivityFromRemote.current) {
      return;
    }
    persistActivity(userId, activity).catch(err => {
      handleError(err, 'useMedicationManager', {
        context: 'persistActivity',
        toastMessage: 'No se pudo guardar el historial en la nube.',
      });
    });
  }, [activity, handleError, hasLoadedPersistedData, userId]);

  useEffect(() => {
    if (hasLoadedPersistedData && userId) {
      persistProfile(userId, profile).catch(err => {
        handleError(err, 'useMedicationManager', {
          context: 'persistProfile',
          toastMessage: 'No se pudo guardar tu perfil en la nube.',
        });
      });
    }
  }, [hasLoadedPersistedData, handleError, profile, userId]);

  useEffect(() => {
    if (!hasLoadedPersistedData) return;
    const gen = ++schedulingGeneration.current;
    scheduleAllMedicineAlarms(medicines, settings, () => schedulingGeneration.current !== gen).catch(err => {
      handleError(err, 'useMedicationManager', {
        context: 'scheduleAllMedicineAlarms',
        toastMessage:
          'No se pudieron reprogramar las alarmas. Verifica permisos en Ajustes.',
      });
    });
  }, [hasLoadedPersistedData, handleError, medicines, settings]);

  const todayKey = useMemo(() => new Date().toDateString(), []);

  const todayActivity = useMemo(
    () =>
      activity.filter(item => new Date(item.date).toDateString() === todayKey),
    [activity, todayKey],
  );

  const takenTodayCount = useMemo(
    () => todayActivity.filter(item => item.taken).length,
    [todayActivity],
  );

  const adherencePercent = useMemo(() => {
    if (medicines.length === 0) {
      return 0;
    }
    return Math.round((takenTodayCount / medicines.length) * 100);
  }, [medicines.length, takenTodayCount]);

  const selectedDateActivities = useMemo(() => {
    const key = selectedHistoryDate.toDateString();
    return activity.filter(item => new Date(item.date).toDateString() === key);
  }, [activity, selectedHistoryDate]);

  const todayStatusByMedication = useMemo(() => {
    const statusMap: Record<string, 'taken' | 'missed'> = {};
    todayActivity.forEach(item => {
      statusMap[item.medicationId] = item.taken ? 'taken' : 'missed';
    });
    return statusMap;
  }, [todayActivity]);

  const missedTodayCount = useMemo(
    () => todayActivity.filter(item => !item.taken).length,
    [todayActivity],
  );

  const pendingTodayCount = useMemo(() => {
    if (!medicines.length) {
      return 0;
    }
    return medicines.filter(item => !todayStatusByMedication[item.id]).length;
  }, [medicines, todayStatusByMedication]);

  const selectTab = (tab: AppTab) => {
    if (tab === 'add') {
      setEditingMedicineId(null);
      setForm(EMPTY_MEDICINE_FORM);
      setShowFormModal(false);
    }
    setActiveTab(tab);
  };

  const openNewForm = () => {
    setEditingMedicineId(null);
    setForm(EMPTY_MEDICINE_FORM);
    setShowFormModal(true);
  };

  const closeForm = () => {
    setShowFormModal(false);
    setEditingMedicineId(null);
    setForm(EMPTY_MEDICINE_FORM);
  };

  const openEditForm = (medicine: Medicine) => {
    setEditingMedicineId(medicine.id);
    setForm({
      name: medicine.name,
      medicineType: medicine.medicineType || EMPTY_MEDICINE_FORM.medicineType,
      unit: medicine.unit || EMPTY_MEDICINE_FORM.unit,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      customFrequencyHours: medicine.customFrequencyHours || '',
      startTime: medicine.startTime,
      foodInstruction:
        medicine.foodInstruction || EMPTY_MEDICINE_FORM.foodInstruction,
      notes: medicine.notes || '',
      alarmEnabled:
        typeof medicine.alarmEnabled === 'boolean'
          ? medicine.alarmEnabled
          : EMPTY_MEDICINE_FORM.alarmEnabled,
      alarmSound: medicine.alarmSound || EMPTY_MEDICINE_FORM.alarmSound,
      snoozeMinutes:
        medicine.snoozeMinutes || EMPTY_MEDICINE_FORM.snoozeMinutes,
      treatmentDays:
        medicine.treatmentDays != null
          ? String(medicine.treatmentDays)
          : '',
    });
    setShowFormModal(true);
  };

  const saveMedicine = async () => {
    const sanitizedForm: MedicineForm = {
      ...form,
      name: sanitizeMedicineName(form.name).trim(),
      dosage: sanitizeDecimal(form.dosage),
      startTime: normalizeTime(form.startTime),
      notes: sanitizeNotes(form.notes).trim(),
    };

    const treatmentDaysNum = sanitizedForm.treatmentDays
      ? parseInt(sanitizedForm.treatmentDays, 10)
      : undefined;

    if (!sanitizedForm.name || !sanitizedForm.dosage.trim()) {
      Alert.alert('Campos incompletos', 'Debes ingresar nombre y dosis.');
      return;
    }

    if (editingMedicineId) {
      setMedicines(current =>
        current.map(item =>
          item.id === editingMedicineId
            ? { ...item, ...sanitizedForm, treatmentDays: treatmentDaysNum }
            : item,
        ),
      );
      setActivity(current =>
        current.map(item =>
          item.medicationId === editingMedicineId
            ? {
                ...item,
                medicationName: sanitizedForm.name,
                scheduledTime: sanitizedForm.startTime,
                dosage: sanitizedForm.dosage,
              }
            : item,
        ),
      );
    } else {
      const newId = `${Date.now()}`;
      const newMedicine: Medicine = {
        id: newId,
        ...sanitizedForm,
        treatmentDays: treatmentDaysNum,
        createdAt: new Date().toISOString(),
        active: true,
      };
      setMedicines(current => [newMedicine, ...current]);
    }

    setShowFormModal(false);
    setEditingMedicineId(null);
    if (activeTab === 'add') {
      setForm(EMPTY_MEDICINE_FORM);
      setActiveTab('medicines');
    }
  };

   const deleteMedicine = (medicineId: string) => {
     Alert.alert('Eliminar medicamento', 'Esta accion no se puede deshacer.', [
       { text: 'Cancelar', style: 'cancel' },
       {
         text: 'Eliminar',
         style: 'destructive',
          onPress: () => {
            pendingDeleteIds.current.add(medicineId);
           setMedicines(current =>
             current.filter(item => item.id !== medicineId),
           );
           setActivity(current =>
             current.filter(item => item.medicationId !== medicineId),
           );
           cancelMedicineAlarms(medicineId).catch(err => {
             handleError(err, 'useMedicationManager', {
               context: 'cancelMedicineAlarms',
               toastMessage:
                 'No se pudo cancelar la alarma. Revisa los permisos desde Ajustes.',
             });
           });
            deleteMedicinesFromFirestore(userId, [medicineId])
              .catch(err => {
                handleError(err, 'useMedicationManager', {
                  context: 'deleteMedicinesFromFirestore',
                  toastMessage:
                    'No se pudo borrar el medicamento en la nube. Se reintentará automáticamente.',
                });
              })
              .finally(() => {
                setTimeout(() => {
                  pendingDeleteIds.current.delete(medicineId);
                }, 3000);
              });
         },
       },
     ]);
   };

  const updateMedicineAlarm = (
    medicineId: string,
    partial: Partial<{
      alarmEnabled: boolean;
      alarmSound: AlarmSoundId;
      snoozeMinutes: SnoozeMinutes;
    }>,
  ) => {
    setMedicines(current =>
      current.map(item =>
        item.id === medicineId
          ? {
              ...item,
              ...partial,
            }
          : item,
      ),
    );
  };

  const markTaken = (medicine: Medicine) => {
    if (todayStatusByMedication[medicine.id]) {
      Alert.alert('Ya registrado', 'Este medicamento ya fue marcado hoy.');
      return;
    }

    const item: ActivityItem = {
      id: `${medicine.id}_${Date.now()}`,
      medicationId: medicine.id,
      medicationName: medicine.name,
      scheduledTime: medicine.startTime,
      dosage: medicine.dosage,
      date: new Date().toISOString(),
      taken: true,
    };
    setActivity(current => [item, ...current]);
  };

  const markMissed = (medicine: Medicine) => {
    if (todayStatusByMedication[medicine.id]) {
      Alert.alert('Ya registrado', 'Este medicamento ya fue marcado hoy.');
      return;
    }

    const item: ActivityItem = {
      id: `${medicine.id}_${Date.now()}`,
      medicationId: medicine.id,
      medicationName: medicine.name,
      scheduledTime: medicine.startTime,
      dosage: medicine.dosage,
      date: new Date().toISOString(),
      taken: false,
    };
    setActivity(current => [item, ...current]);
  };

  return {
    activeTab,
    setActiveTab: selectTab,
    showFormModal,
    setShowFormModal,
    editingMedicineId,
    selectedHistoryDate,
    setSelectedHistoryDate,
    medicines,
    activity,
    profile,
    setProfile,
    form,
    setForm,
    medicationCatalog,
    takenTodayCount,
    adherencePercent,
    selectedDateActivities,
    todayStatusByMedication,
    missedTodayCount,
    pendingTodayCount,
    openNewForm,
    closeForm,
    openEditForm,
    saveMedicine,
    deleteMedicine,
    updateMedicineAlarm,
    markTaken,
    markMissed,
  };
}
