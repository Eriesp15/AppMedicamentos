const {Router} = require('express');
const {create, list, remove, update} = require('../controllers/medication.controller');
const {requireAuth} = require('../middlewares/auth.middleware');

const medicationRouter = Router();

medicationRouter.get('/', requireAuth, list);
medicationRouter.post('/', requireAuth, create);
medicationRouter.put('/:medicationId', requireAuth, update);
medicationRouter.delete('/:medicationId', requireAuth, remove);

module.exports = {medicationRouter};
