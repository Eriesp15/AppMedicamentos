const {db} = require('../models/inMemoryDb');

function getProfileByUserId(userId) {
  return db.profiles.find(item => item.userId === userId) || null;
}

function updateProfileByUserId(userId, data) {
  const profile = getProfileByUserId(userId);
  if (!profile) {
    return null;
  }

  Object.assign(profile, {
    fullName: data.fullName ?? profile.fullName,
    age: data.age ?? profile.age,
    phone: data.phone ?? profile.phone,
    emergencyContact: data.emergencyContact ?? profile.emergencyContact,
    bloodType: data.bloodType ?? profile.bloodType,
    allergies: data.allergies ?? profile.allergies,
    chronicConditions: data.chronicConditions ?? profile.chronicConditions,
  });

  return profile;
}

module.exports = {getProfileByUserId, updateProfileByUserId};
