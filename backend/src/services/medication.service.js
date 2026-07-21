const {randomUUID} = require('crypto');
const {db} = require('../models/inMemoryDb');

function listMedications(userId) {
  return db.medications.filter(item => item.userId === userId);
}

function createMedication(userId, payload) {
  const medication = {
    id: payload.id || randomUUID(),
    userId,
    name: payload.name.trim(),
    medicineType: payload.medicineType || '',
    unit: payload.unit || '',
    dosage: payload.dosage.trim(),
    frequency: payload.frequency,
    customFrequencyHours: payload.customFrequencyHours || '',
    startTime: payload.startTime,
    foodInstruction: payload.foodInstruction || '',
    notes: payload.notes || '',
    alarmEnabled: typeof payload.alarmEnabled === 'boolean' ? payload.alarmEnabled : false,
    alarmSound: payload.alarmSound || 'default',
    snoozeMinutes: payload.snoozeMinutes || 10,
    treatmentDays: payload.treatmentDays ?? null,
    active: typeof payload.active === 'boolean' ? payload.active : true,
    createdAt: payload.createdAt || new Date().toISOString(),
  };
  db.medications.unshift(medication);
  return medication;
}

function updateMedication(userId, medicationId, payload) {
  const medication = db.medications.find(
    item => item.id === medicationId && item.userId === userId,
  );
  if (!medication) {
    return null;
  }

  medication.name = payload.name?.trim() ?? medication.name;
  medication.medicineType = payload.medicineType ?? medication.medicineType;
  medication.unit = payload.unit ?? medication.unit;
  medication.dosage = payload.dosage?.trim() ?? medication.dosage;
  medication.frequency = payload.frequency ?? medication.frequency;
  medication.customFrequencyHours = payload.customFrequencyHours ?? medication.customFrequencyHours;
  medication.startTime = payload.startTime ?? medication.startTime;
  medication.foodInstruction = payload.foodInstruction ?? medication.foodInstruction;
  medication.notes = payload.notes ?? medication.notes;
  medication.alarmEnabled = payload.alarmEnabled ?? medication.alarmEnabled;
  medication.alarmSound = payload.alarmSound ?? medication.alarmSound;
  medication.snoozeMinutes = payload.snoozeMinutes ?? medication.snoozeMinutes;
  medication.treatmentDays = payload.treatmentDays ?? medication.treatmentDays;
  medication.active = payload.active ?? medication.active;
  return medication;
}

function deleteMedication(userId, medicationId) {
  const index = db.medications.findIndex(
    item => item.id === medicationId && item.userId === userId,
  );
  if (index < 0) {
    return false;
  }
  db.medications.splice(index, 1);
  return true;
}

module.exports = {
  listMedications,
  createMedication,
  updateMedication,
  deleteMedication,
};
