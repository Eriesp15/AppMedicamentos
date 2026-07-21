const {Router} = require('express');
const {authRouter} = require('./auth.routes');
const {healthRouter} = require('./health.routes');
const {logsRouter} = require('./logs.routes');
const {medicationRouter} = require('./medication.routes');
const {profileRouter} = require('./profile.routes');

const apiRouter = Router();

apiRouter.use('/', healthRouter);
apiRouter.use('/', logsRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/medications', medicationRouter);

module.exports = {apiRouter};
