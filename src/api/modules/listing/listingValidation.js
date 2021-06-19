const { celebrate, Joi } = require('celebrate');
const { sortBy } = require('lodash');

module.exports = {
  search: celebrate(
    {
      query: {
        city: Joi.string().required(),
        pageNo: Joi.number().integer().min(1).required(),
        resultsPerPage: Joi.number().integer().min(5).required(),
        lowerPriceLimit: Joi.number()
          .positive()
          .precision(2)
          .when('sortBy', {
            is: Joi.exist().equal('price'),
            then: Joi.required(),
          }),
        upperPriceLimit: Joi.number()
          .positive()
          .precision(2)
          .when('sortBy', {
            is: Joi.exist().equal('price'),
            then: Joi.required(),
          }),
        ratings: Joi.number()
          .integer()
          .min(2)
          .max(5)
          .default(4),
        sortBy: Joi.string().valid('ratings', 'price', 'updatedAt').default('price'),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
  getListingById: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  updateListing: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  createListing: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  getListingByUserId: celebrate(
    {
      params: {
        userId: Joi.string().required(),
      },
    },
    { allowUnknown: false, abortEarly: false },
  ),
  uploadListingImages: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
  deleteListing: celebrate(
    {
      headers: {},
      query: {},
      params: {},
      body: {},
    },
    { allowUnknown: true, abortEarly: false },
  ),
};
