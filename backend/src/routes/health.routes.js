const {Router} = require('express');
const {healthCheck} = require('../controllers/health.controller');

const healthRouter = Router();

healthRouter.get('/health', healthCheck);

module.exports = {healthRouter};
