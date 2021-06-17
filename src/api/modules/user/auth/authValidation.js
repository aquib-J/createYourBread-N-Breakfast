const { celebrate, Joi } = require('celebrate');

module.exports = {
  signup: celebrate(
    {
      body: {
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        emailId: Joi.string().trim().email().required(),
        password: Joi.string().trim().required(),
        dob: Joi.date().less(new Date()).required(),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
  login: celebrate(
    {
      body: {
        emailId: Joi.string().trim().email().required(),
        password: Joi.string().required(),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
  getResetLink: celebrate(
    {
      body: {
        emailId: Joi.string().trim().email().required(),
        urlPathTemplate: Joi.string().trim().required(),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
  reset: celebrate(
    {
      params: {
        resetToken: Joi.string().trim().uuid().required(),
      },
      body: {
        emailId: Joi.string().trim().email().required(),
        password: Joi.string().required(),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
};
