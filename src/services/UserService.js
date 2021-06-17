const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const Authentication = require('./AuthenticationService');
const Redis = require('../loaders/redis');
const { Queues } = require('../queues');
const {
  constants: {
    emailJobTypes: { resetEmail, signupEmail, postResetEmail, bookingCancellation, bookingConfirmation },
  },
} = require('../utils');

class UserService {
  static async createUser(params) {
    try {
      let allowedResponseKeys = ['id'];
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
      return { data: { userId: user.get({ plain: true }).id } };
    } catch (err) {
      Logger.log('error', 'error creating user ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getResetLink(params) {
    try {
      Logger.log('info', ' sending the reset email with the token');

      let jobData = {
        emailId: params.emailId,
        resetToken: params.session.resetToken,
        urlTemplate: params.urlPathTemplate,
      };

      const Job = await Queues.enqueueEmailJobs(resetEmail, jobData);
      //TODO: fix the reset email task with appropriate HTML and urlTemplate prefixed
      return { message: `Email with the reset link has been sent to ${params.emailId}` };
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

      const Job = await Queues.enqueueEmailJobs(postResetEmail, jobData);

      //TODO: update the queue config for this job type and add appropriate HTML
      return { data: { userId: plainUser.id } };
    } catch (err) {
      Logger.log('error', 'error in reseting the user credentials', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async getUser(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
      Logger.log('info', 'getting user');
      const user = await models.user.findOne({
        attributes: ['id', 'firstName', 'lastName', 'bio', 'emailId', 'dob', 'profilePictureUrl', 'updatedAt'],
        where: {
          id: params.userId,
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
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
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
          id: params.userId,
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
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
      const fullUser = await Redis.get(`${params.userId}-CompleteUserRecord`);

      if (fullUser) return { data: fullUser };

      let usersOwnListing = await models.listing.findAll({
        attributes: ['id'],
        where: {
          userId: params.userId,
        },
      });

      if (usersOwnListing && usersOwnListing.length) {
        usersOwnListing = usersOwnListing.reduce((arr, responseObject) => {
          arr.push(responseObject.id);
          return arr;
        }, []);
      }
      const user = await models.user.findAll({
        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },

        where: {
          id: params.userId,
        },
        include: [
          {
            model: models.listing,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [
              {
                model: models.image,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
              },
              {
                model: models.review,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                  {
                    model: models.user,
                    attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
                  },
                ],
              },
              {
                model: models.booking,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

                includes: [
                  {
                    model: models.payment,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                  },
                ],
              },
              {
                model: models.city,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

                include: [
                  {
                    model: models.state,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

                    include: [
                      {
                        model: models.country,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: models.review,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            where: {
              listingId: {
                [Op.notIn]: usersOwnListing,
              },
            },
            required: false,
          },
          {
            model: models.bookmark,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

            where: {
              listingId: {
                [Op.notIn]: usersOwnListing,
              },
            },
            required: false,

            include: [
              {
                model: models.listing,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

                include: [
                  {
                    model: models.user,
                    attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
                  },
                  {
                    model: models.image,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                  },
                  {
                    model: models.city,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

                    include: [
                      {
                        model: models.state,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

                        include: [
                          {
                            model: models.country,
                            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: models.booking,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            where: {
              listingId: {
                [Op.notIn]: usersOwnListing,
              },
            },
            required: false,
            include: [
              {
                model: models.payment,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
              },
            ],
          },
        ],
      });

      if (user && user.length) {
        Redis.set(`${params.userId}-CompleteUserRecord`, user, 900);
        return { data: user };
      }
      throw Response.createError(Message.userNotFound);
    } catch (err) {
      Logger.log('error', 'error fetching the complete user record', err);
      throw Response.createError(Message.tryAgain, err);
    }
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
      return { data: params.image.location, message: 'Successfully uploaded the display pic ' };
    } catch (err) {
      Logger.log('error', 'error uploading display pic ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = UserService;
