export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  startTime: string;
  notes: string;
  active: boolean;
}

export interface Activity {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  actualTime?: string;
  taken: boolean;
  date: string;
}

export interface MedicationStats {
  totalMedicines: number;
  takingToday: number;
  adherencePercent: number;
}
