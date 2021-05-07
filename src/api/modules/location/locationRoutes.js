const { Router } = require('express');
const validation = require('./locationValidation');
const controller = require('./locationControllers');
const { PushToBody } = require('./../../middlewares');
const router = Router();

// get all countries
router.get('/countries', controller.getCountries);
// get all states for a particular country id
router.get('/states/:id', validation.getStates, PushToBody, controller.getStates);
// get all cities for a particular state id
router.get('/cities/:id', validation.getCities, PushToBody, controller.getCities);

module.exports = router;
