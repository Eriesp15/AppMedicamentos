const {
  ensureProfileByUserId,
  updateProfileByUserId,
} = require('../services/profile.service');

function getProfile(req, res) {
  const defaults = {
    fullName: req.user.fullName || '',
  };
  // Garantiza que el usuario tenga siempre un registro, incluso si su
  // cuenta sólo existe en Firebase y nunca pasó por `registerUser`.
  const profile = ensureProfileByUserId(req.user.id, defaults);
  return res.status(200).json(profile);
}

function updateProfile(req, res) {
  const profile = updateProfileByUserId(req.user.id, req.body || {});
  return res.status(200).json(profile);
}

module.exports = {getProfile, updateProfile};
