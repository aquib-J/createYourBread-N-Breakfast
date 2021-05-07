const { Logger, Response, Message } = require('./../utils');
const { models } = require('./../loaders/sequelize');

class UtilityService {
  static async getCountries(params) {
    try {
      const countries = await models.country.findAll({
        raw: true,
      });
      if (countries) return { data: countries.get({ plain: true }) };
      throw Response.createError(Message.tryAgain);
    } catch (err) {
      Logger.log('error', 'error fetching country', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async getStates(params) {
    try {
      const states = await models.state.findAll({
        where: {
          countryId: params.id,
        },
        raw: true,
      });
      if (states) return { data: states.get({ plain: true }) };
      throw Response.createError(Message.tryAgain);
    } catch (err) {
      Logger.log('error', 'error fetching states', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getCities(params) {
    try {
      const cities = await models.city.findAll({
        where: {
          stateId: params.id,
        },
        raw: true,
      });
      if (cities) return { data: cities.get({ plain: true }) };
      throw Response.createError(Message.tryAgain);
    } catch (err) {
      Logger.log('error', 'error fetching cities', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = UtilityService;
