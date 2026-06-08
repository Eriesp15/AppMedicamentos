import {
  AlarmSoundId,
  AppTab,
  MedicineForm,
  SnoozeMinutes,
  UserProfile,
} from '../types/medication';

export const STORAGE_KEYS = {
  MEDICINES: '@medicare/medicines',
  ACTIVITY: '@medicare/activity',
  PROFILE: '@medicare/profile',
  APP_SETTINGS: '@medicare/app_settings',
};

export const TAB_ITEMS: { id: AppTab; label: string; icon: string }[] = [
  { id: 'home', label: 'Inicio', icon: '⌂' },
  { id: 'medicines', label: 'Medicina', icon: '●●' },
  { id: 'add', label: 'Agregar', icon: '+' },
  { id: 'schedules', label: 'Horarios', icon: '□' },
  { id: 'tracking', label: 'Progreso', icon: '▥' },
];

export const MEDICINE_TYPES = [
  'Pastilla',
  'Jarabe',
  'Inyeccion',
  'Capsula',
  'Gotas',
  'Inhalador',
];

export const MEDICINE_UNITS = ['mg', 'ml', 'g', 'gotas', 'unidades', 'puffs'];

export const FOOD_OPTIONS = ['Con alimentos', 'Sin alimentos'];

export const ALARM_SOUND_OPTIONS: {
  id: AlarmSoundId;
  label: string;
  channelName: string;
  androidSound: string;
}[] = [
  {
    id: 'gentle',
    label: 'Suave',
    channelName: 'Alarmas suaves',
    androidSound: 'med_alarm_gentle',
  },
  {
    id: 'default',
    label: 'Normal',
    channelName: 'Alarmas normales',
    androidSound: 'default',
  },
  {
    id: 'classic',
    label: 'Clasico',
    channelName: 'Alarmas clasicas',
    androidSound: 'med_alarm_classic',
  },
];

export const SNOOZE_OPTIONS: SnoozeMinutes[] = [5, 10, 15, 30];

export const FREQUENCIES = [
  { id: 'cada8h', label: 'Cada 8 horas' },
  { id: 'cada12h', label: 'Cada 12 horas' },
  { id: 'cada24h', label: 'Cada 24 horas' },
  { id: 'diaria', label: '1 vez al dia' },
];

export const INPUT_LIMITS = {
  MEDICINE_NAME: 45,
  MEDICINE_DOSAGE: 40,
  MEDICINE_TIME: 5,
  MEDICINE_NOTES: 140,
  PROFILE_FULL_NAME: 60,
  PROFILE_AGE: 3,
  PROFILE_PHONE: 16,
  PROFILE_EMERGENCY_CONTACT: 70,
  PROFILE_BLOOD_TYPE: 4,
  PROFILE_ALLERGIES: 140,
  PROFILE_CHRONIC_CONDITIONS: 140,
};

export const EMPTY_MEDICINE_FORM: MedicineForm = {
  name: '',
  medicineType: MEDICINE_TYPES[0],
  unit: MEDICINE_UNITS[0],
  dosage: '',
  frequency: FREQUENCIES[0].id,
  startTime: '08:00',
  foodInstruction: FOOD_OPTIONS[0],
  notes: '',
  alarmEnabled: true,
  alarmSound: 'default',
  snoozeMinutes: 10,
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

export const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Maria',
  age: '',
  phone: '',
  emergencyContact: '',
  bloodType: '',
  allergies: '',
  chronicConditions: '',
};
