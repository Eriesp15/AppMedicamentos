import {
  AlarmSoundId,
  AppTab,
  MedicationSuggestion,
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
  {
    id: 'loud',
    label: 'Fuerte',
    channelName: 'Alarmas fuertes',
    androidSound: 'med_alarm_loud',
  },
];

export const SNOOZE_OPTIONS: SnoozeMinutes[] = [5, 10, 15, 30];

export const FREQUENCIES = [
  { id: 'cada8h', label: 'Cada 8 horas' },
  { id: 'cada12h', label: 'Cada 12 horas' },
  { id: 'cada24h', label: 'Cada 24 horas' },
  { id: 'diaria', label: '1 vez al dia' },
  { id: 'otra', label: 'Otra' },
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

export const MEDICATION_DATABASE: MedicationSuggestion[] = [
  // Analgésicos / Antiinflamatorios
  { name: 'Paracetamol', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Paracetamol Infantil', medicineType: 'Gotas', unit: 'gotas', dosage: '15', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Paracetamol Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '7.5', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Ibuprofeno', medicineType: 'Pastilla', unit: 'mg', dosage: '400', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Ibuprofeno Infantil', medicineType: 'Gotas', unit: 'gotas', dosage: '10', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Ibuprofeno Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '7.5', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Naproxeno', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Diclofenaco', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Diclofenaco Inyectable', medicineType: 'Inyeccion', unit: 'ml', dosage: '75', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Metamizol', medicineType: 'Gotas', unit: 'gotas', dosage: '40', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Metamizol Pastilla', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Tramadol', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Ketorolaco', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Ketorolaco Inyectable', medicineType: 'Inyeccion', unit: 'ml', dosage: '30', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Meloxicam', medicineType: 'Pastilla', unit: 'mg', dosage: '15', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Piroxicam', medicineType: 'Pastilla', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Celecoxib', medicineType: 'Capsula', unit: 'mg', dosage: '200', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Indometacina', medicineType: 'Capsula', unit: 'mg', dosage: '25', frequency: 'cada12h', foodInstruction: 'Con alimentos' },

  // Antibióticos
  { name: 'Amoxicilina', medicineType: 'Capsula', unit: 'mg', dosage: '500', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Amoxicilina Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Amoxicilina + Acido Clavulanico', medicineType: 'Pastilla', unit: 'mg', dosage: '875', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Azitromicina', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Ciprofloxacino', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Doxiciclina', medicineType: 'Capsula', unit: 'mg', dosage: '100', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Metronidazol', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Trimetoprima + Sulfametoxazol', medicineType: 'Pastilla', unit: 'mg', dosage: '800', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Clindamicina', medicineType: 'Capsula', unit: 'mg', dosage: '300', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Cefalexina', medicineType: 'Capsula', unit: 'mg', dosage: '500', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Cefalexina Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Nitrofurantoina', medicineType: 'Capsula', unit: 'mg', dosage: '100', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Levofloxacino', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Eritromicina', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Cloranfenicol Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '2', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },

  // Antihipertensivos
  { name: 'Enalapril', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Losartan', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Amlodipino', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Metoprolol', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Captopril', medicineType: 'Pastilla', unit: 'mg', dosage: '25', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Nifedipino', medicineType: 'Pastilla', unit: 'mg', dosage: '30', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Hidroclorotiazida', medicineType: 'Pastilla', unit: 'mg', dosage: '25', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Valsartan', medicineType: 'Pastilla', unit: 'mg', dosage: '80', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Carvedilol', medicineType: 'Pastilla', unit: 'mg', dosage: '25', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Espironolactona', medicineType: 'Pastilla', unit: 'mg', dosage: '25', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Propranolol', medicineType: 'Pastilla', unit: 'mg', dosage: '40', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Telmisartan', medicineType: 'Pastilla', unit: 'mg', dosage: '40', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Antidiabéticos
  { name: 'Metformina', medicineType: 'Pastilla', unit: 'mg', dosage: '850', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Glibenclamida', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Insulina NPH', medicineType: 'Inyeccion', unit: 'unidades', dosage: '20', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Insulina Rapida', medicineType: 'Inyeccion', unit: 'unidades', dosage: '10', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Sitagliptina', medicineType: 'Pastilla', unit: 'mg', dosage: '100', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Empagliflozina', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Dapagliflozina', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Liraglutida', medicineType: 'Inyeccion', unit: 'mg', dosage: '1.2', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Pioglitazona', medicineType: 'Pastilla', unit: 'mg', dosage: '30', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Acarbosa', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada8h', foodInstruction: 'Con alimentos' },

  // Cardiovasculares
  { name: 'Atorvastatina', medicineType: 'Pastilla', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Simvastatina', medicineType: 'Pastilla', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Aspirina Infantil', medicineType: 'Pastilla', unit: 'mg', dosage: '100', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Aspirina', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Digoxina', medicineType: 'Pastilla', unit: 'mg', dosage: '0.25', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Furosemida', medicineType: 'Pastilla', unit: 'mg', dosage: '40', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Furosemida Inyectable', medicineType: 'Inyeccion', unit: 'ml', dosage: '20', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Warfarina', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Clopidogrel', medicineType: 'Pastilla', unit: 'mg', dosage: '75', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Rosuvastatina', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Nitroglicerina Sublingual', medicineType: 'Pastilla', unit: 'mg', dosage: '0.5', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Isosorbida', medicineType: 'Pastilla', unit: 'mg', dosage: '20', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Heparina', medicineType: 'Inyeccion', unit: 'unidades', dosage: '5000', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },

  // Respiratorio
  { name: 'Salbutamol Inhalador', medicineType: 'Inhalador', unit: 'puffs', dosage: '2', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Salbutamol Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Montelukast', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Budesonida Inhalador', medicineType: 'Inhalador', unit: 'puffs', dosage: '2', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Loratadina', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Loratadina Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Cetirizina', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Desloratadina', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Fluticasona Inhalador', medicineType: 'Inhalador', unit: 'puffs', dosage: '2', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Salmeterol + Fluticasona', medicineType: 'Inhalador', unit: 'puffs', dosage: '2', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Ipratropio Inhalador', medicineType: 'Inhalador', unit: 'puffs', dosage: '2', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Prednisona', medicineType: 'Pastilla', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Dexametasona', medicineType: 'Pastilla', unit: 'mg', dosage: '4', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Dexametasona Inyectable', medicineType: 'Inyeccion', unit: 'ml', dosage: '4', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Deflazacort', medicineType: 'Pastilla', unit: 'mg', dosage: '30', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Beclometasona Inhalador', medicineType: 'Inhalador', unit: 'puffs', dosage: '2', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Tiotropio Inhalador', medicineType: 'Inhalador', unit: 'puffs', dosage: '1', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Azelastina Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '2', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },

  // Gastrointestinales
  { name: 'Omeprazol', medicineType: 'Capsula', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Omeprazol Suspension', medicineType: 'Jarabe', unit: 'ml', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Pantoprazol', medicineType: 'Pastilla', unit: 'mg', dosage: '40', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Esomeprazol', medicineType: 'Pastilla', unit: 'mg', dosage: '40', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Ranitidina', medicineType: 'Pastilla', unit: 'mg', dosage: '150', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Domperidona', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Domperidona Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Metoclopramida', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Loperamida', medicineType: 'Pastilla', unit: 'mg', dosage: '2', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Hioscina', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Hioscina Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '20', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Sucralfato', medicineType: 'Pastilla', unit: 'mg', dosage: '1000', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Ondansetron', medicineType: 'Pastilla', unit: 'mg', dosage: '8', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Ondansetron Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Lactulosa', medicineType: 'Jarabe', unit: 'ml', dosage: '15', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Bismuto Subsalicilato', medicineType: 'Pastilla', unit: 'mg', dosage: '262', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Simeticona', medicineType: 'Gotas', unit: 'gotas', dosage: '30', frequency: 'cada8h', foodInstruction: 'Con alimentos' },

  // Sistema Nervioso / Psiquiatría
  { name: 'Sertralina', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Fluoxetina', medicineType: 'Capsula', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Escitalopram', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Paroxetina', medicineType: 'Pastilla', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Venlafaxina', medicineType: 'Pastilla', unit: 'mg', dosage: '75', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Duloxetina', medicineType: 'Capsula', unit: 'mg', dosage: '60', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Amitriptilina', medicineType: 'Pastilla', unit: 'mg', dosage: '25', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Clonazepam', medicineType: 'Pastilla', unit: 'mg', dosage: '0.5', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Clonazepam Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '10', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Alprazolam', medicineType: 'Pastilla', unit: 'mg', dosage: '0.5', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Diazepam', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Diazepam Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '15', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Lorazepam', medicineType: 'Pastilla', unit: 'mg', dosage: '1', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Carbamazepina', medicineType: 'Pastilla', unit: 'mg', dosage: '200', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Acido Valproico', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Fenitoina', medicineType: 'Pastilla', unit: 'mg', dosage: '100', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Gabapentina', medicineType: 'Capsula', unit: 'mg', dosage: '300', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Pregabalina', medicineType: 'Capsula', unit: 'mg', dosage: '75', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Levetiracetam', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Risperidona', medicineType: 'Pastilla', unit: 'mg', dosage: '2', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Olanzapina', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Quetiapina', medicineType: 'Pastilla', unit: 'mg', dosage: '100', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Haloperidol', medicineType: 'Gotas', unit: 'gotas', dosage: '5', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Metilfenidato', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Biperideno', medicineType: 'Pastilla', unit: 'mg', dosage: '2', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Levodopa + Carbidopa', medicineType: 'Pastilla', unit: 'mg', dosage: '250', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },

  // Tiroides / Hormonas
  { name: 'Levotiroxina', medicineType: 'Pastilla', unit: 'mg', dosage: '0.1', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Metimazol', medicineType: 'Pastilla', unit: 'mg', dosage: '15', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Propiltiouracilo', medicineType: 'Pastilla', unit: 'mg', dosage: '100', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },

  // Antialérgicos
  { name: 'Difenhidramina', medicineType: 'Pastilla', unit: 'mg', dosage: '25', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Fexofenadina', medicineType: 'Pastilla', unit: 'mg', dosage: '120', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Ebastina', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Clorfenamina', medicineType: 'Pastilla', unit: 'mg', dosage: '4', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Ketotifeno Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '2', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },

  // Antivirales
  { name: 'Aciclovir', medicineType: 'Pastilla', unit: 'mg', dosage: '400', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Aciclovir Crema', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Oseltamivir', medicineType: 'Capsula', unit: 'mg', dosage: '75', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Valaciclovir', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Ritonavir', medicineType: 'Pastilla', unit: 'mg', dosage: '100', frequency: 'cada12h', foodInstruction: 'Con alimentos' },

  // Antifúngicos
  { name: 'Fluconazol', medicineType: 'Capsula', unit: 'mg', dosage: '150', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Itraconazol', medicineType: 'Capsula', unit: 'mg', dosage: '100', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Terbinafina', medicineType: 'Pastilla', unit: 'mg', dosage: '250', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Clotrimazol Crema', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Nistatina Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '5', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Ketoconazol Crema', medicineType: 'Pastilla', unit: 'mg', dosage: '20', frequency: 'diaria', foodInstruction: 'Sin alimentos' },

  // Antigotosos
  { name: 'Alopurinol', medicineType: 'Pastilla', unit: 'mg', dosage: '300', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Colchicina', medicineType: 'Pastilla', unit: 'mg', dosage: '0.5', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Febuxostat', medicineType: 'Pastilla', unit: 'mg', dosage: '80', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Antianémicos
  { name: 'Sulfato Ferroso', medicineType: 'Pastilla', unit: 'mg', dosage: '200', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Acido Folico', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Vitamina B12', medicineType: 'Pastilla', unit: 'mg', dosage: '1', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Cianocobalamina Inyectable', medicineType: 'Inyeccion', unit: 'ml', dosage: '1', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Hierro Polimaltosado Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Vitaminas y Suplementos
  { name: 'Vitamina C', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Vitamina D', medicineType: 'Gotas', unit: 'gotas', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Calcio + Vitamina D', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Complejo B', medicineType: 'Pastilla', unit: 'mg', dosage: '1', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Magnesio', medicineType: 'Pastilla', unit: 'mg', dosage: '400', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Zinc', medicineType: 'Pastilla', unit: 'mg', dosage: '15', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Omega 3', medicineType: 'Capsula', unit: 'mg', dosage: '1000', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Multivitaminico', medicineType: 'Pastilla', unit: 'mg', dosage: '1', frequency: 'cada24h', foodInstruction: 'Con alimentos' },

  // Anticonceptivos
  { name: 'Etinilestradiol + Levonorgestrel', medicineType: 'Pastilla', unit: 'mg', dosage: '0.15', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Drospirenona + Etinilestradiol', medicineType: 'Pastilla', unit: 'mg', dosage: '3', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Medroxiprogesterona Inyectable', medicineType: 'Inyeccion', unit: 'ml', dosage: '150', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Implante Etonogestrel', medicineType: 'Inyeccion', unit: 'mg', dosage: '68', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Desogestrel', medicineType: 'Pastilla', unit: 'mg', dosage: '0.075', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Sistema Urinario / Prostata
  { name: 'Tamsulosina', medicineType: 'Capsula', unit: 'mg', dosage: '0.4', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Finasterida', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Dutasterida', medicineType: 'Capsula', unit: 'mg', dosage: '0.5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Oxibutinina', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Sildenafil', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Tadalafil', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Oftálmicos
  { name: 'Lágrimas Artificiales', medicineType: 'Gotas', unit: 'gotas', dosage: '2', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Timolol Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '1', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Tropicamida Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '1', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Ciprofloxacino Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '2', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Dexametasona Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '2', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Latanoprost Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '1', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Dorzolamida Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '1', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Brimonidina Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '1', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Olopatadina Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '1', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Tobramicina Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '2', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Neomicina Gotas', medicineType: 'Gotas', unit: 'gotas', dosage: '2', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },

  // Dermatológicos (tópicos orales)
  { name: 'Isotretinoina', medicineType: 'Capsula', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Doxiciclina Acne', medicineType: 'Capsula', unit: 'mg', dosage: '100', frequency: 'cada24h', foodInstruction: 'Con alimentos' },

  // Antipalúdicos / Autoinmunes
  { name: 'Hidroxicloroquina', medicineType: 'Pastilla', unit: 'mg', dosage: '200', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Metotrexato', medicineType: 'Pastilla', unit: 'mg', dosage: '7.5', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Sulfasalazina', medicineType: 'Pastilla', unit: 'mg', dosage: '500', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Colchicina Gota', medicineType: 'Gotas', unit: 'gotas', dosage: '10', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Azatioprina', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada24h', foodInstruction: 'Con alimentos' },

  // Antiparasitarios
  { name: 'Albendazol', medicineType: 'Pastilla', unit: 'mg', dosage: '400', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Mebendazol', medicineType: 'Pastilla', unit: 'mg', dosage: '100', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Secnidazol', medicineType: 'Pastilla', unit: 'mg', dosage: '2000', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Ivermectina', medicineType: 'Pastilla', unit: 'mg', dosage: '6', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Bifosfonatos / Osteoporosis
  { name: 'Alendronato', medicineType: 'Pastilla', unit: 'mg', dosage: '70', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Risedronato', medicineType: 'Pastilla', unit: 'mg', dosage: '35', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
  { name: 'Raloxifeno', medicineType: 'Pastilla', unit: 'mg', dosage: '60', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Anticoagulantes modernos
  { name: 'Rivaroxaban', medicineType: 'Pastilla', unit: 'mg', dosage: '20', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Apixaban', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Edoxaban', medicineType: 'Pastilla', unit: 'mg', dosage: '60', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Enoxaparina', medicineType: 'Inyeccion', unit: 'mg', dosage: '40', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Broncodilatadores
  { name: 'Teofilina', medicineType: 'Pastilla', unit: 'mg', dosage: '200', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Formoterol Inhalador', medicineType: 'Inhalador', unit: 'puffs', dosage: '1', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },

  // Antitusivos / Expectorantes
  { name: 'Dextrometorfano Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '10', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Bromhexina Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'N-Acetilcisteina', medicineType: 'Pastilla', unit: 'g', dosage: '600', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'N-Acetilcisteina Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '10', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Carbocisteina Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },
  { name: 'Ambroxol Jarabe', medicineType: 'Jarabe', unit: 'ml', dosage: '5', frequency: 'cada8h', foodInstruction: 'Con alimentos' },

  // Antihistamínicos H2
  { name: 'Famotidina', medicineType: 'Pastilla', unit: 'mg', dosage: '40', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Nizatidina', medicineType: 'Capsula', unit: 'mg', dosage: '300', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },

  // Antihipertensivos adicionales
  { name: 'Doxazosina', medicineType: 'Pastilla', unit: 'mg', dosage: '4', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Prazosina', medicineType: 'Pastilla', unit: 'mg', dosage: '1', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Terazosina', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Clonidina', medicineType: 'Pastilla', unit: 'mg', dosage: '0.1', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Metildopa', medicineType: 'Pastilla', unit: 'mg', dosage: '250', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Minoxidil', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Hidralazina', medicineType: 'Pastilla', unit: 'mg', dosage: '25', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Atenolol', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Bisoprolol', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Nebivolol', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Verapamilo', medicineType: 'Pastilla', unit: 'mg', dosage: '240', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Diltiazem', medicineType: 'Pastilla', unit: 'mg', dosage: '60', frequency: 'cada8h', foodInstruction: 'Sin alimentos' },

  // Lípidos adicionales
  { name: 'Ezetimiba', medicineType: 'Pastilla', unit: 'mg', dosage: '10', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Fenofibrato', medicineType: 'Capsula', unit: 'mg', dosage: '200', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Gemfibrozilo', medicineType: 'Pastilla', unit: 'mg', dosage: '600', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Colestiramina', medicineType: 'Pastilla', unit: 'g', dosage: '4', frequency: 'cada12h', foodInstruction: 'Con alimentos' },

  // Antidiabéticos adicionales
  { name: 'Gliclazida', medicineType: 'Pastilla', unit: 'mg', dosage: '80', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Glimepirida', medicineType: 'Pastilla', unit: 'mg', dosage: '2', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Repaglinida', medicineType: 'Pastilla', unit: 'mg', dosage: '1', frequency: 'cada8h', foodInstruction: 'Con alimentos' },
  { name: 'Insulina Glargina', medicineType: 'Inyeccion', unit: 'unidades', dosage: '20', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Insulina Detemir', medicineType: 'Inyeccion', unit: 'unidades', dosage: '14', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Canagliflozina', medicineType: 'Pastilla', unit: 'mg', dosage: '100', frequency: 'cada24h', foodInstruction: 'Con alimentos' },
  { name: 'Saxagliptina', medicineType: 'Pastilla', unit: 'mg', dosage: '5', frequency: 'cada24h', foodInstruction: 'Sin alimentos' },
  { name: 'Vildagliptina', medicineType: 'Pastilla', unit: 'mg', dosage: '50', frequency: 'cada12h', foodInstruction: 'Con alimentos' },
  { name: 'Exenatida', medicineType: 'Inyeccion', unit: 'mg', dosage: '0.01', frequency: 'cada12h', foodInstruction: 'Sin alimentos' },
  { name: 'Dulaglutida', medicineType: 'Inyeccion', unit: 'mg', dosage: '1.5', frequency: 'diaria', foodInstruction: 'Sin alimentos' },
];

export const EMPTY_MEDICINE_FORM: MedicineForm = {
  name: '',
  medicineType: MEDICINE_TYPES[0],
  unit: MEDICINE_UNITS[0],
  dosage: '',
  frequency: FREQUENCIES[0].id,
  customFrequencyHours: '',
  startTime: '08:00',
  foodInstruction: FOOD_OPTIONS[0],
  notes: '',
  alarmEnabled: true,
  alarmSound: 'default',
  snoozeMinutes: 10,
  treatmentDays: '',
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
