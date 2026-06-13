const {
  getProfileByUserId,
  updateProfileByUserId,
} = require('../services/profile.service');

function getProfile(req, res) {
  const profile = getProfileByUserId(req.user.id);
  if (!profile) {
    return res.status(404).json({message: 'PROFILE_NOT_FOUND'});
  }
  return res.status(200).json(profile);
}

function updateProfile(req, res) {
  const profile = updateProfileByUserId(req.user.id, req.body || {});
  if (!profile) {
    return res.status(404).json({message: 'PROFILE_NOT_FOUND'});
  }
  return res.status(200).json(profile);
}

module.exports = {getProfile, updateProfile};
