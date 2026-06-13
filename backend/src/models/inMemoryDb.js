const {randomUUID} = require('crypto');

const db = {
  users: [],
  profiles: [],
  medications: [],
};

function createUser({fullName, email, password}) {
  const user = {
    id: randomUUID(),
    fullName,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);

  db.profiles.push({
    userId: user.id,
    fullName,
    age: '',
    phone: '',
    emergencyContact: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
  });

  return user;
}

module.exports = {db, createUser};
