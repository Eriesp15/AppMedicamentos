import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Medication,
  MedicationSchedule,
  UserProfile,
  Appointment,
} from '../types';

const MEDICATIONS_KEY = '@medicare_medications';
const SCHEDULES_KEY = '@medicare_schedules';
const USER_KEY = '@medicare_user';
const APPOINTMENTS_KEY = '@medicare_appointments';

// Medications Storage
export const getMedications = async (): Promise<Medication[]> => {
  try {
    const data = await AsyncStorage.getItem(MEDICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading medications:', error);
    return [];
  }
};

export const saveMedication = async (medication: Medication): Promise<void> => {
  try {
    const medications = await getMedications();
    const index = medications.findIndex((m) => m.id === medication.id);
    if (index > -1) {
      medications[index] = medication;
    } else {
      medications.push(medication);
    }
    await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  } catch (error) {
    console.error('Error saving medication:', error);
  }
};

export const deleteMedication = async (medicationId: string): Promise<void> => {
  try {
    const medications = await getMedications();
    const filtered = medications.filter((m) => m.id !== medicationId);
    await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting medication:', error);
  }
};

// Medication Schedule Storage
export const getSchedules = async (): Promise<MedicationSchedule[]> => {
  try {
    const data = await AsyncStorage.getItem(SCHEDULES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading schedules:', error);
    return [];
  }
};

export const saveSchedule = async (schedule: MedicationSchedule): Promise<void> => {
  try {
    const schedules = await getSchedules();
    const index = schedules.findIndex((s) => s.id === schedule.id);
    if (index > -1) {
      schedules[index] = schedule;
    } else {
      schedules.push(schedule);
    }
    await AsyncStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Error saving schedule:', error);
  }
};

export const getSchedulesByDate = async (
  date: string
): Promise<MedicationSchedule[]> => {
  try {
    const schedules = await getSchedules();
    return schedules.filter((s) => s.date === date);
  } catch (error) {
    console.error('Error reading schedules by date:', error);
    return [];
  }
};

// User Profile Storage
export const getUser = async (): Promise<UserProfile | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading user profile:', error);
    return null;
  }
};

export const saveUser = async (user: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

// Appointments Storage
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const data = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading appointments:', error);
    return [];
  }
};

export const saveAppointment = async (appointment: Appointment): Promise<void> => {
  try {
    const appointments = await getAppointments();
    const index = appointments.findIndex((a) => a.id === appointment.id);
    if (index > -1) {
      appointments[index] = appointment;
    } else {
      appointments.push(appointment);
    }
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  } catch (error) {
    console.error('Error saving appointment:', error);
  }
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const appointments = await getAppointments();
    const filtered = appointments.filter((a) => a.id !== appointmentId);
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting appointment:', error);
  }
};

// Initialization
export const initializeDummyData = async (): Promise<void> => {
  try {
    const existingMeds = await getMedications();
    if (existingMeds.length === 0) {
      const dummyMedications: Medication[] = [
        {
          id: '1',
          name: 'Aspirina',
          dosage: '100mg',
          frequency: 'daily',
          times: ['08:00'],
          color: '#FF6B6B',
          icon: 'pill',
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Metformina',
          dosage: '500mg',
          frequency: 'daily',
          times: ['12:00'],
          color: '#4ECDC4',
          icon: 'pill',
          createdAt: Date.now(),
        },
        {
          id: '3',
          name: 'Losartán',
          dosage: '50mg',
          frequency: 'daily',
          times: ['20:00'],
          color: '#45B7D1',
          icon: 'pill',
          createdAt: Date.now(),
        },
      ];
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(dummyMedications));
    }
  } catch (error) {
    console.error('Error initializing dummy data:', error);
  }
};
