export type AppTab = 'home' | 'medicines' | 'add' | 'schedules' | 'tracking';

export type MedicineType =
  | 'Pastilla'
  | 'Jarabe'
  | 'Inyeccion'
  | 'Capsula'
  | 'Gotas'
  | 'Inhalador';

export type Medicine = {
  id: string;
  name: string;
  medicineType: MedicineType;
  unit: string;
  dosage: string;
  frequency: number;
  startTime: string;
  foodInstruction: string;
  notes: string;
  alarmEnabled: boolean;
  alarmSound: AlarmSoundId;
  snoozeMinutes: SnoozeMinutes;
  createdAt: string;
  active: boolean;
  treatmentDays?: number;
  remainingDays?: number;
  userId: string;
};

export type DoseEvent = {
  medicine: Medicine;
  scheduledTime: string;
};

export type ActivityItem = {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  date: string;
  taken: boolean;
};

export type MedicineForm = {
  name: string;
  medicineType: MedicineType;
  unit: string;
  dosage: string;
  frequency: string;
  startTime: string;
  foodInstruction: string;
  notes: string;
  alarmEnabled: boolean;
  alarmSound: AlarmSoundId;
  snoozeMinutes: SnoozeMinutes;
  treatmentDays: string;
};

export type UserProfile = {
  fullName: string;
  phone: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  photo: string;
};

export type MedicationSuggestion = {
  name: string;
  medicineType: MedicineType;
  unit: string;
  dosage: string;
  frequency: number;
  foodInstruction: string;
};

export type AlarmSoundId = 'gentle' | 'default' | 'classic' | 'loud';

export type SnoozeMinutes = 5 | 10 | 15 | 30;
