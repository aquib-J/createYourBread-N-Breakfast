const { celebrate, Joi } = require('celebrate');

module.exports = {
  getUser: celebrate(
    {
      params: {
        userId: Joi.string().required(),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
  getCompleteUserRecord: celebrate(
    {
      params: {
        userId: Joi.string().required(),
      },
    },
    { allowUnknown: true, abortEarly: false },
  ),
  updateUser: celebrate(
    {
      params: {
        userId: Joi.string().required(),
      },
      body: {
        firstName: Joi.string().trim(),
        lastName: Joi.string().trim(),
        bio: Joi.string().trim(),
        emailId: Joi.string().trim().email(),
        dob: Joi.date().less(new Date()),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
  dpUpload: celebrate(
    {
      params: {
        userId: Joi.string().required(),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
};
