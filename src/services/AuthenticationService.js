const bcrypt = require('bcrypt');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('./../utils');

const SALT_ROUNDS = 12;

class Authentication {
  static async hashPassword(plainTextPassword, salt = SALT_ROUNDS) {
    try {
      Logger.log('info', 'hashing password using bcrypt');
      const hash = await bcrypt.hash(plainTextPassword, salt);
      return hash;
    } catch (err) {
      Logger.log('error', 'error hashing the password using bcrypt', err);
      Response.createError(Message.tryAgain, err);
    }
  }

  static async compareHashedPassword(plainTextPassword, hash) {
    try {
      Logger.log('info', 'comparing hash to password provided');
      const status = await bcrypt.compare(plainTextPassword, hash);
      return status;
    } catch (err) {
      Logger.log('error', 'error hashing password using bcrypt', err);
      Response.createError(Message.tryAgain, err);
    }
  }

  static async fetchUserHash(params) {
    try {
      const hash = await models.user.findOne({
        attributes: ['password', 'id'],
        where: {
          emailId: params.emailId,
        },
        raw: true,
      });
      return hash;
    } catch (err) {
      Logger.log('error', 'error fetching the hash with the email Id ', err);
      Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = Authentication;
