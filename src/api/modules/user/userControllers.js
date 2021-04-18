const { Response, Logger } = require('../../../utils');
const { UserService } = require('../../../services');

class UserController {
  static async signup(req, res) {
    try {
      Logger.log('info', 'signing up a user');
      const servRes = await UserService.signup(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async login(req, res) {
    try {
      Logger.log('info', 'signing up a user');
      const servRes = await UserService.login(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async logout(req, res) {
    try {
      Logger.log('info', 'signing up a user');
      const servRes = await UserService.logout(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async fetchUserInfo(req, res) {
    try {
      Logger.log('info', 'signing up a user');
      const servRes = await UserService.fetchUserInfo(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async editUser(req, res) {
    try {
      Logger.log('info', 'signing up a user');
      const servRes = await UserService.editUser(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async createUser(req, res) {
    try {
      Logger.log('info', 'signing up a user');
      const servRes = await UserService.createUser(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async dpUpload(req, res) {
    try {
      Logger.log('info', 'signing up a user');
      const servRes = await UserService.dpUpload(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = UserController;
