const {db, createUser} = require('../models/inMemoryDb');

function buildToken(user) {
  const payload = JSON.stringify({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
  });

  return Buffer.from(payload).toString('base64url');
}

function registerUser({fullName, email, password}) {
  const normalizedEmail = email.toLowerCase().trim();
  const exists = db.users.find(item => item.email === normalizedEmail);

  if (exists) {
    throw new Error('EMAIL_ALREADY_REGISTERED');
  }

  const user = createUser({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
  });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
    token: buildToken(user),
  };
}

function loginUser({email, password}) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = db.users.find(item => item.email === normalizedEmail);

  if (!user || user.password !== password) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
    token: buildToken(user),
  };
}

function getUserFromToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
    const user = db.users.find(item => item.id === decoded.userId);
    return user || null;
  } catch {
    return null;
  }
}

module.exports = {registerUser, loginUser, getUserFromToken};
