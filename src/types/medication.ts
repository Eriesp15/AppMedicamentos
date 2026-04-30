export type AppTab = 'home' | 'medicines' | 'history' | 'tips' | 'profile';

export type Medicine = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startTime: string;
  notes: string;
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
  dosage: string;
  frequency: string;
  startTime: string;
  notes: string;
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
