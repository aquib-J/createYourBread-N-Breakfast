const { Router } = require('express');
const validation = require('./authValidation');
const controller = require('./authControllers');
const { PushToBody, Authenticate } = require('../../../middlewares');

const route = Router();

// signs up and creates a user : email Id is unique

route.post('/signup', validation.signup, PushToBody, controller.signup);

route.post('/login', validation.login, Authenticate.attachSession, PushToBody, controller.login);

route.post('/logout', Authenticate.checkSession, Authenticate.destroySession, controller.logout);

route.post(
  '/reset-link',
  validation.getResetLink,
  Authenticate.attachResetSession,
  PushToBody,
  controller.getResetLink,
);

route.post(
  '/reset/:resetToken',
  validation.reset,
  Authenticate.checkSession,
  Authenticate.destroySession,
  PushToBody,
  controller.reset,
);

module.exports = route;
