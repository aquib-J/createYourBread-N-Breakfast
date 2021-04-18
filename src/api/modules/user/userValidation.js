const { celebrate, Joi } = require('celebrate');

module.exports = {
  signup: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  login: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  logout: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  fetchUserInfo: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  editUser: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  createUser: celebrate(
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
};
