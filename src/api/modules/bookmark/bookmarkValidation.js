const { celebrate, Joi } = require('celebrate');

module.exports = {
  createBookmark: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  getBookmark: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  deleteBookmark: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    {
      allowUnknown: true,
      abortEarly: false,
    },
  ),
};
