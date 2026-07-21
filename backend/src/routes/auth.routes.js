const {Router} = require('express');
const {login, register, firebaseSync} = require('../controllers/auth.controller');

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/firebase-sync', firebaseSync);

module.exports = {authRouter};
