const {Router} = require('express');
const {getProfile, updateProfile} = require('../controllers/profile.controller');
const {requireAuth} = require('../middlewares/auth.middleware');

const profileRouter = Router();

profileRouter.get('/me', requireAuth, getProfile);
profileRouter.put('/me', requireAuth, updateProfile);

module.exports = {profileRouter};
