export type AppTab = 'home' | 'medicines' | 'add' | 'schedules' | 'tracking';

export type Medicine = {
  id: string;
  name: string;
  medicineType: string;
  unit: string;
  dosage: string;
  frequency: string;
  startTime: string;
  foodInstruction: string;
  notes: string;
  alarmEnabled: boolean;
  alarmSound: AlarmSoundId;
  snoozeMinutes: SnoozeMinutes;
  createdAt: string;
  active: boolean;
};

export type ActivityItem = {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  dosage: string;
  date: string;
  taken: boolean;
};

export type MedicineForm = {
  name: string;
  medicineType: string;
  unit: string;
  dosage: string;
  frequency: string;
  startTime: string;
  foodInstruction: string;
  notes: string;
  alarmEnabled: boolean;
  alarmSound: AlarmSoundId;
  snoozeMinutes: SnoozeMinutes;
};

export type UserProfile = {
  fullName: string;
  age: string;
  phone: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
};

export type AlarmSoundId = 'gentle' | 'default' | 'classic';

export type SnoozeMinutes = 5 | 10 | 15 | 30;
