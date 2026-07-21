const {db} = require('../models/inMemoryDb');

function getProfileByUserId(userId) {
  return db.profiles.find(item => item.userId === userId) || null;
}

/**
 * Devuelve el perfil del usuario y, si no existe, lo crea con valores
 * por defecto vinculados al `userId`. Permite que usuarios autenticados
 * sólo vía Firebase (sin `registerUser`) tengan igualmente un registro
 * en el backend la primera vez que tocan el endpoint de perfil.
 */
function ensureProfileByUserId(userId, defaults = {}) {
  const existing = getProfileByUserId(userId);
  if (existing) {
    return existing;
  }
  const profile = {
    userId,
    fullName: defaults.fullName || '',
    phone: defaults.phone || '',
    emergencyContact: defaults.emergencyContact || '',
    bloodType: defaults.bloodType || '',
    allergies: defaults.allergies || '',
    chronicConditions: defaults.chronicConditions || '',
    createdAt: new Date().toISOString(),
  };
  db.profiles.push(profile);
  return profile;
}

function updateProfileByUserId(userId, data) {
  // Si el usuario nunca llegó por `registerUser`, su primera escritura
  // al perfil crea la fila en lugar de devolver 404. Esto evita que un
  // signup vía Firebase quede sin registro en el backend.
  const profile = ensureProfileByUserId(userId);

  profile.fullName = data.fullName?.trim() ?? profile.fullName;
  profile.phone = data.phone ?? profile.phone;
  profile.emergencyContact =
    data.emergencyContact ?? profile.emergencyContact;
  profile.bloodType = data.bloodType ?? profile.bloodType;
  profile.allergies = data.allergies ?? profile.allergies;
  profile.chronicConditions = data.chronicConditions ?? profile.chronicConditions;

  return profile;
}

module.exports = {
  getProfileByUserId,
  ensureProfileByUserId,
  updateProfileByUserId,
};
