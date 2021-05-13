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
      const servRes = { message: `user successfully logged in` };
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async logout(req, res) {
    try {
      Logger.log('info', 'logging out user');
      const servRes = { message: `user successfully logged out !!` };
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async getResetLink(req, res) {
    try {
      Logger.log('info', 'generating reset link');
      const servRes = await UserService.getResetLink(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async reset(req, res) {
    try {
      Logger.log('info', 'resetting the new credentials');
      const servRes = await UserService.reset(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = AuthController;
