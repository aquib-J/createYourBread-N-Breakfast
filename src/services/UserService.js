const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const Authentication = require('./AuthenticationService');
const Email = require('./EmailService');

class UserService {
  static async createUser(params) {
    try {
      Logger.log('info', 'fetching user info for idempotency check');

      let user = await models.user.findOne({
        attributes: ['id'],
        where: {
          emailId: params.emailId,
        },
        raw: true,
      });
      if (user) throw Response.createError(Message.userExists);

      Logger.log('info', 'generating hash ');

      const password = await Authentication.hashPassword(params.password);

      Logger.log('info', 'creating user record in db');

      user = await models.user.create({
        firstName: params.firstName,
        lastName: params.lastName,
        emailId: params.emailId,
        password,
        dob: params.dob,
        profilePictureUrl: params.profilePictureUrl,
      });

      Logger.log('info', 'sending welcome email to the user');

      await Email.signupEmail(params.emailId); //TODO: move it to a job-queue or a worker thread, takes too long

      return { data: user.get({ plain: true }) };
    } catch (err) {
      Logger.log('error', 'error creating user ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getResetLink(params) {
    return;
  }
  static async reset(params) {
    return;
  }

  static async getUser(params) {
    try {
      Logger.log('info', 'getting user');
      const user = await models.user.findOne({
        attributes: ['id', 'firstName', 'lastName', 'bio', 'emailId', 'dob', 'profilePictureUrl', 'updatedAt'],
        where: {
          id: params.id,
        },
        raw: true,
      });
      if (user) return { data: user };
      throw Response.createError(Message.userNotFound);
    } catch (err) {
      Logger.log('error', 'error fetching user details', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async updateUser(params) {
    try {
      Logger.log('info', 'updating user ');
      let user = await models.user.update(
        {
          ...params.body,
        },
        {
          where: {
            id: params.id,
          },
        },
      );
      if (user) return { data: user.get({ plain: true }) };
      throw Response.createError(Message.errorUpdatingUser);
    } catch (err) {
      Logger.log('error', 'error updating user', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getCompleteUserRecord(params) {
    return;
  }
  static async dpUpload(params) {
    return;
  }
}

module.exports = UserService;
