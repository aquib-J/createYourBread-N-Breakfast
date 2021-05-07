const { celebrate, Joi } = require('celebrate');

module.exports = {
  getUser: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  getCompleteUserRecord: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  updateUser: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  dpUpload: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
};
