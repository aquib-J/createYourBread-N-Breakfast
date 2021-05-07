const { celebrate, Joi } = require('celebrate');

module.exports = {
  createBooking: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  getBooking: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
};
