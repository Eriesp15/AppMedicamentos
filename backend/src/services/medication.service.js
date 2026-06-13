const {randomUUID} = require('crypto');
const {db} = require('../models/inMemoryDb');

function listMedications(userId) {
  return db.medications.filter(item => item.userId === userId);
}

function createMedication(userId, payload) {
  const medication = {
    id: randomUUID(),
    userId,
    name: payload.name.trim(),
    dosage: payload.dosage.trim(),
    frequency: payload.frequency,
    startTime: payload.startTime,
    notes: payload.notes || '',
    active: true,
    createdAt: new Date().toISOString(),
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
  medication.dosage = payload.dosage?.trim() ?? medication.dosage;
  medication.frequency = payload.frequency ?? medication.frequency;
  medication.startTime = payload.startTime ?? medication.startTime;
  medication.notes = payload.notes ?? medication.notes;
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
