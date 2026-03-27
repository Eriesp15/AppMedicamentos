import React, { createContext, useContext, useEffect, useState } from 'react';
import { Medication, MedicationSchedule, MedicationContextType } from '../types';
import {
  getMedications,
  saveMedication,
  deleteMedication,
  getSchedulesByDate,
  saveSchedule,
  getSchedules,
  initializeDummyData,
} from '../utils/storage';
import {
  getCurrentDateString,
  shouldShowMedicationToday,
} from '../utils/dateUtils';

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    loadMedications();
    initializeDummyData();
  }, []);

  const loadMedications = async () => {
    const data = await getMedications();
    setMedications(data);
  };

  const addMedication = async (medication: Medication) => {
    await saveMedication(medication);
    await loadMedications();

    // Create schedules for this medication
    const today = getCurrentDateString();
    for (const time of medication.times) {
      const scheduleId = `${medication.id}-${today}-${time}`;
      const schedule: MedicationSchedule = {
        id: scheduleId,
        medicationId: medication.id,
        date: today,
        time,
        status: 'pending',
      };
      await saveSchedule(schedule);
    }
  };

  const editMedication = async (medication: Medication) => {
    await saveMedication(medication);
    await loadMedications();
  };

  const deleteMedication_ = async (id: string) => {
    await deleteMedication(id);
    await loadMedications();
  };

  const getMedicationsByDate = async (date: string): Promise<MedicationSchedule[]> => {
    const schedules = await getSchedulesByDate(date);
    return schedules;
  };

  const getTodaysMedications = async (): Promise<MedicationSchedule[]> => {
    const today = getCurrentDateString();
    const schedules = await getSchedulesByDate(today);

    // If no schedules exist for today, create them from medications
    if (schedules.length === 0) {
      const newSchedules: MedicationSchedule[] = [];
      for (const med of medications) {
        if (shouldShowMedicationToday(med.frequency, med.specificDays)) {
          for (const time of med.times) {
            const scheduleId = `${med.id}-${today}-${time}`;
            const schedule: MedicationSchedule = {
              id: scheduleId,
              medicationId: med.id,
              date: today,
              time,
              status: 'pending',
            };
            newSchedules.push(schedule);
            await saveSchedule(schedule);
          }
        }
      }
      return newSchedules;
    }

    return schedules;
  };

  const updateMedicationStatus = async (
    scheduleId: string,
    status: 'taken' | 'missed'
  ) => {
    const schedules = await getSchedules();
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (schedule) {
      schedule.status = status;
      if (status === 'taken') {
        schedule.takenAt = Date.now();
      }
      await saveSchedule(schedule);
    }
  };

  const value: MedicationContextType = {
    medications,
    addMedication,
    editMedication,
    deleteMedication: deleteMedication_,
    getMedicationsByDate,
    updateMedicationStatus,
    getTodaysMedications,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within MedicationProvider');
  }
  return context;
};
