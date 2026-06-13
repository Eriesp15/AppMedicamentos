const {loginUser, registerUser} = require('../services/auth.service');

function register(req, res) {
  const {fullName, email, password} = req.body || {};
  if (!fullName || !email || !password) {
    return res.status(400).json({message: 'MISSING_REQUIRED_FIELDS'});
  }

  try {
    const result = registerUser({fullName, email, password});
    return res.status(201).json(result);
  } catch (error) {
    if (error.message === 'EMAIL_ALREADY_REGISTERED') {
      return res.status(409).json({message: error.message});
    }
    return res.status(500).json({message: 'INTERNAL_SERVER_ERROR'});
  }
}

function login(req, res) {
  const {email, password} = req.body || {};
  if (!email || !password) {
    return res.status(400).json({message: 'MISSING_CREDENTIALS'});
  }

  try {
    const result = loginUser({email, password});
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({message: error.message});
    }
    return res.status(500).json({message: 'INTERNAL_SERVER_ERROR'});
  }
}

module.exports = {register, login};
