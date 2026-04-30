import {AppTab, MedicineForm} from '../types/medication';

export const STORAGE_KEYS = {
  MEDICINES: '@medicare/medicines',
  ACTIVITY: '@medicare/activity',
};

export const TAB_ITEMS: {id: AppTab; label: string; icon: string}[] = [
  {id: 'home', label: 'Inicio', icon: '🏠'},
  {id: 'medicines', label: 'Medicinas', icon: '💊'},
  {id: 'history', label: 'Historial', icon: '📋'},
  {id: 'tips', label: 'Consejos', icon: '💡'},
];

export const FREQUENCIES = [
  {id: 'cada8h', label: 'Cada 8 horas'},
  {id: 'cada12h', label: 'Cada 12 horas'},
  {id: 'cada24h', label: 'Cada 24 horas'},
  {id: 'diaria', label: '1 vez al dia'},
];

export const EMPTY_MEDICINE_FORM: MedicineForm = {
  name: '',
  dosage: '',
  frequency: FREQUENCIES[0].id,
  startTime: '08:00',
  notes: '',
};

export const TIPS = [
  {
    title: 'Beber agua con tus medicinas',
    description:
      'Tomar medicamentos con agua favorece la absorcion y protege el estomago.',
  },
  {
    title: 'No te automediques',
    description:
      'No cambies dosis ni combines farmacos sin consultar al medico tratante.',
  },
  {
    title: 'Que hacer si olvidaste una dosis',
    description:
      'Si olvidas una toma, no dupliques dosis. Revisa indicacion medica y retoma horario.',
  },
  {
    title: 'Almacenamiento correcto',
    description:
      'Guarda medicamentos lejos de humedad, calor y luz directa para mantener eficacia.',
  },
];
