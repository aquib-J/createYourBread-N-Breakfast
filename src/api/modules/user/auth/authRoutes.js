const { Router } = require('express');
const validation = require('./authValidation');
const controller = require('./authControllers');
const { PushToBody } = require('../../../middlewares');

const route = Router();

route.post('/signup', validation.signup, PushToBody, controller.signup);
// signs up and creates a user : email id is unique

route.post('/login', validation.login, PushToBody, controller.login);

// separate get method on login for the frontEnd to hit and acquire session info
// route.get('/login', validation.login, controller.returnSessionInfo);

route.get('/logout', validation.logout, controller.logout);

//TODO: send a reset link to email which will allow the user to change the password
// route.post('/reset')

module.exports = route;
