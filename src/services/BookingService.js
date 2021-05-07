const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const Authentication = require('./AuthenticationService');

class BookingService {
  static async createBooking(params) {
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
      Logger.log('info', 'creating user');
      user = await models.user.create({
        firstName: params.firstName,
        lastName: params.lastName,
        emailId: params.emailId,
        password: params.password,
        dob: params.dob,
        profilePictureUrl: params.profilePictureUrl,
      });
      return { data: user.get({ plain: true }) };
    } catch (err) {
      Logger.log('error', 'error creating user ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async getBooking(params) {
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

}

module.exports = BookingService;
