const {Router} = require('express');
const {getLogs, receiveLog} = require('../controllers/logs.controller');

const logsRouter = Router();

logsRouter.get('/logs', getLogs);
logsRouter.post('/logs', receiveLog);

module.exports = {logsRouter};
