const { Response, Logger } = require('../../../utils');
const { UtilityService:locationService } = require('../../../services');

class LocationController {
  static async getCountries(req, res) {
    try {
      Logger.log('info', 'fetching all the countries');
      const servRes = await locationService.getCountries(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async getStates(req, res) {
    try {
      Logger.log('info', 'fetching all the states');
      const servRes = await locationService.getStates(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async getCities(req, res) {
    try {
      Logger.log('info', 'fetching all the cities');
      const servRes = await locationService.getCities(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = LocationController;