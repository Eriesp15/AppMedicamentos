const {
  createMedication,
  deleteMedication,
  listMedications,
  updateMedication,
} = require('../services/medication.service');

function list(req, res) {
  return res.status(200).json(listMedications(req.user.id));
}

function create(req, res) {
  const {name, dosage, frequency, startTime} = req.body || {};
  if (!name || !dosage || !frequency || !startTime) {
    return res.status(400).json({message: 'MISSING_REQUIRED_FIELDS'});
  }
  const medication = createMedication(req.user.id, req.body);
  return res.status(201).json(medication);
}

function update(req, res) {
  const medication = updateMedication(req.user.id, req.params.medicationId, req.body || {});
  if (!medication) {
    return res.status(404).json({message: 'MEDICATION_NOT_FOUND'});
  }
  return res.status(200).json(medication);
}

function remove(req, res) {
  const deleted = deleteMedication(req.user.id, req.params.medicationId);
  if (!deleted) {
    return res.status(404).json({message: 'MEDICATION_NOT_FOUND'});
  }
  return res.status(204).send();
}

module.exports = {list, create, update, remove};
