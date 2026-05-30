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
