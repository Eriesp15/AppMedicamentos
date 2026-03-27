// Type definitions for MediCare app
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'specific_days';
  times: string[]; // Array of times like "08:00"
  specificDays?: number[]; // 0-6 for Sunday-Saturday if frequency is specific_days
  color: string;
  icon: string;
  notes?: string;
  createdAt: number;
}

export interface MedicationSchedule {
  id: string;
  medicationId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'pending' | 'taken' | 'missed';
  takenAt?: number; // timestamp
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  doctorName?: string;
  doctorPhone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  location?: string;
}

export interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Medication) => Promise<void>;
  editMedication: (medication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  getMedicationsByDate: (date: string) => Promise<MedicationSchedule[]>;
  updateMedicationStatus: (scheduleId: string, status: 'taken' | 'missed') => Promise<void>;
  getTodaysMedications: () => Promise<MedicationSchedule[]>;
}

export interface UserContextType {
  user: UserProfile | null;
  updateUser: (user: UserProfile) => Promise<void>;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}
