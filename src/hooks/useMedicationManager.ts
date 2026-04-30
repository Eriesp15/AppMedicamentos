import {useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {EMPTY_MEDICINE_FORM} from '../constants/data';
import {
  ActivityItem,
  AppTab,
  Medicine,
  MedicineForm,
} from '../types/medication';
import {
  loadPersistedData,
  persistActivity,
  persistMedicines,
} from '../storage/medicationStorage';

export function useMedicationManager() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date());

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [form, setForm] = useState<MedicineForm>(EMPTY_MEDICINE_FORM);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadPersistedData();
        setMedicines(data.medicines);
        setActivity(data.activity);
      } catch {
        Alert.alert('Error', 'No se pudo cargar la informacion local.');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    persistMedicines(medicines).catch(() => {});
  }, [medicines]);

  useEffect(() => {
    persistActivity(activity).catch(() => {});
  }, [activity]);

  const todayKey = useMemo(() => new Date().toDateString(), []);

  const todayActivity = useMemo(
    () => activity.filter(item => new Date(item.date).toDateString() === todayKey),
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

  const openNewForm = () => {
    setEditingMedicineId(null);
    setForm(EMPTY_MEDICINE_FORM);
    setShowFormModal(true);
  };

  const openEditForm = (medicine: Medicine) => {
    setEditingMedicineId(medicine.id);
    setForm({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      startTime: medicine.startTime,
      notes: medicine.notes || '',
    });
    setShowFormModal(true);
  };

  const saveMedicine = () => {
    if (!form.name.trim() || !form.dosage.trim()) {
      Alert.alert('Campos incompletos', 'Debes ingresar nombre y dosis.');
      return;
    }

    if (editingMedicineId) {
      setMedicines(current =>
        current.map(item =>
          item.id === editingMedicineId
            ? {...item, ...form, name: form.name.trim()}
            : item,
        ),
      );
    } else {
      const newMedicine: Medicine = {
        id: `${Date.now()}`,
        ...form,
        name: form.name.trim(),
        createdAt: new Date().toISOString(),
        active: true,
      };
      setMedicines(current => [newMedicine, ...current]);
    }

    setShowFormModal(false);
    setEditingMedicineId(null);
  };

  const deleteMedicine = (medicineId: string) => {
    Alert.alert('Eliminar medicamento', 'Esta accion no se puede deshacer.', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          setMedicines(current => current.filter(item => item.id !== medicineId));
          setActivity(current => current.filter(item => item.medicationId !== medicineId));
        },
      },
    ]);
  };

  const markTaken = (medicine: Medicine) => {
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
    setActiveTab,
    showFormModal,
    setShowFormModal,
    editingMedicineId,
    selectedHistoryDate,
    setSelectedHistoryDate,
    medicines,
    activity,
    form,
    setForm,
    takenTodayCount,
    adherencePercent,
    selectedDateActivities,
    openNewForm,
    openEditForm,
    saveMedicine,
    deleteMedicine,
    markTaken,
    markMissed,
  };
}
