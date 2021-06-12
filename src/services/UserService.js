const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const Authentication = require('./AuthenticationService');
const { Queues } = require('../queues');
const {
  constants: {
    emailJobTypes: { resetEmail, signupEmail, bookingCancellation, bookingConfirmation },
  },
} = require('../utils');

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
      const Job = await Queues.enqueueEmailJobs(signupEmail, { email: params.emailId });
      return { data: { Job, user: user.get({ plain: true }) } };
    } catch (err) {
      Logger.log('error', 'error creating user ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getResetLink(params) {
    try {
      Logger.log('info', ' sending the reset email with the token');

      let jobData = { emailId: params.emailId, resetToken: params.session.resetToken };

      const Job = await Queues.enqueueEmailJobs(resetEmail, jobData);

      return { message: `Email with the reset link sent successfully`, data: Job.data };
    } catch (err) {
      Logger.log('error', 'error in sending reset link', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async reset(params) {
    try {
      Logger.log('info', 'updating the user credentials in the db');

      const password = await Authentication.hashPassword(params.password);

      const user = await models.user.update(
        { password },
        { where: { emailId: params.emailId }, returning: true, plain: true },
      );

      let plainUser = JSON.parse(JSON.stringify(user[1]));

      ['password', 'createdAt', 'updatedAt', 'deletedAt'].forEach((field) => delete plainUser[field]);

      //TODO: send an email as well saying your login credentials have been updated
      return { data: plainUser };
    } catch (err) {
      Logger.log('error', 'error in reseting the user credentials', err);
      throw Response.createError(Message.tryAgain, err);
    }
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
      if (params.session.userId !== params.id) throw Response.createError(Message.InconsistentCredentials);
      Logger.log('info', 'updating user details');

      let allowedFields = [];
      Object.keys(params).forEach((key) => {
        if (['session', 'cookie', 'id', 'emailId', 'password'].includes(key)) return;
        else allowedFields.push(key);
      });

      let updateObject = {};

      allowedFields.forEach((key) => {
        updateObject[key] = params[key];
      });
      let user = await models.user.update(updateObject, {
        where: {
          id: params.id,
        },
        returning: true,
        plain: true,
      });

      let plainUser = JSON.parse(JSON.stringify(user[1]));

      ['password', 'createdAt', 'updatedAt', 'deletedAt'].forEach((field) => delete plainUser[field]);

      return { data: plainUser };
    } catch (err) {
      Logger.log('error', 'error updating user', err);
      throw Response.createError(Message.errorUpdatingUser);
    }
  }
  static async getCompleteUserRecord(params) {
    //TODO: can only happen when the corresponding tables are filled with values
    return;
  }
  static async dpUpload(params) {
    try {
      Logger.log('info', 'updating the user record with the s3 display pic url');
      const user = await models.user.update(
        {
          profilePictureUrl: params.image.location,
        },
        {
          where: {
            id: params.userId,
          },
        },
      );
      return { data: params.image.location, message: 'Successfully uploaded the display pic and updated' };
    } catch (err) {
      Logger.log('error', 'error uploading display pic ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = UserService;
