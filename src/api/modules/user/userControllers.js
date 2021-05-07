const { Response, Logger } = require('../../../utils');
const { UserService } = require('../../../services');

class UserController {
  static async getUser(req, res) {
    try {
      Logger.log('info', 'fetch user info');
      const servRes = await UserService.getUser(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }

  static async getCompleteUserRecord(req, res) {
    try {
      Logger.log('info', 'fetch complete user data record');
      const servRes = await UserService.getCompleteUserRecord(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async updateUser(req, res) {
    try {
      Logger.log('info', 'updating user info');
      let params = { body: req.body, id: req.params.id };
      const servRes = await UserService.updateUser(params);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async dpUpload(req, res) {
    try {
      Logger.log('info', 'upload user profile pic');
      const servRes = await UserService.dpUpload(req.headers, req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = UserController;
