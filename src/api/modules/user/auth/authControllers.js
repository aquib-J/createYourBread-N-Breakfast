const { Response, Logger } = require('../../../../utils');
const { UserService } = require('../../../../services');

class AuthController {
  static async signup(req, res) {
    try {
      Logger.log('info', 'signing up a user');
      const servRes = await UserService.createUser(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async login(req, res) {
    try {
      Logger.log('info', 'logging in a user');
      const servRes = await UserService.login(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async logout(req, res) {
    try {
      Logger.log('info', 'logging out user');
      const servRes = await UserService.logout(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = AuthController;
