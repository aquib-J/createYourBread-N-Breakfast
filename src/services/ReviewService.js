const { Op, Sequelize } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const moment = require('moment');

class ReviewService {
  static blackListedFields = [
    'createdAt',
    'updatedAt',
    'deletedAt',
    'password',
    'miscCostPercentage',
    'policies',
    'amenities',
    'bathrooms',
    'status',
    'metadata',
    'features',
    'images',
  ];
  static async createReview(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
      // userId <----> listingId ( no implicit mapping to booking as the previous rating on a particular listing for a booking will have already factored into the rating of the place calculated periodically by the TODO: job server)
      // Just need to make sure this user has a booking recently and no review has been made for this listing after the booking duration, then we allow
      // a brand new review for the latest booking
      Logger.log(
        'info',
        'fetching latest booking info for this customer for the same listing info to reconcile the latest review',
      );

      let booking = await models.booking.findAll({
        attributes: ['checkInDate', 'checkOutDate', 'status'],
        where: {
          [Op.and]: {
            listingId: params.listingId,
            userId: params.userId,
          },
        },
        order: [['checkOutDate', 'DESC']],
        limit: 1,
      });

      let review = await models.review.findAll({
        attributes: ['createdAt'],
        where: {
          [Op.and]: {
            listingId: params.listingId,
            userId: params.userId,
          },
        },
        order: [['createdAt', 'DESC']],
        limit: 1,
      });
      if (booking && booking.length) {
        if (booking[0].status === 'BOOKED') {
          if (review && review.length) {
            let d1 = moment(booking[0].checkOutDate);
            let d2 = moment(review[0].createdAt);
            let diff = d2.diff(d1, 'days');
            if (diff >= 0) throw Response.createError(Message.AlreadyReviewedForTheLatestBooking);
          }
        }
      }

      review = await models.review.create({
        rating: params.rating,
        description: params.description,
        userId: params.userId,
        listingId: params.listingId,
      });

      return { data: review.get({ plain: true }) };
    } catch (err) {
      Logger.log('error', 'error creating Review for the listing by the user ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getUserReviews(params) {
    if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);

    /**
     * here, we'll get all the user reviews and sort them month-Wise, listing wise and booking wise (which can be displayed in the user's private account section )
     * and return listing images as well , could be useful in building UI blocks
     */
    try {
      Logger.log('info', 'getting all the reviews by this user');
      let userReviews = await models.review.findAll({
        where: {
          userId: params.userId,
        },
        include: [
          {
            model: models.listing,
            include: [
              {
                model: models.image,
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      userReviews = JSON.parse(JSON.stringify(userReviews));

      let response = [];
      userReviews.forEach((review) => {
        let resp = {
          ...review,
          listing: {
            ...this.filter(review.listing, this.blackListedFields),
            images: review.listing.images.map((image) => this.filter(image, this.blackListedFields)),
          },
        };
        response.push(resp);
      });
      return { data: response };
    } catch (err) {
      Logger.log('error', 'error fetching all the reviews by this user', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async getListingReviews(params) {
    /**
     * here, we'll get all the latest review per user per listing according to the user's latest booking for this listing and have
     * user's profile pic as well in the response
     */
    try {
      Logger.log('info', 'getting all the reviews for this listing');

      let listingReviews = await models.review.findAll({
        where: {
          listingId: params.listingId,
        },
        include: [
          {
            model: models.user,
          },
          {
            model: models.listing,
            include: [
              {
                model: models.image,
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      listingReviews = JSON.parse(JSON.stringify(listingReviews));

      let uniqueUserReviews = [];
      let uniqueUsers = [];
      uniqueUserReviews = listingReviews.map((x) => {
        if (uniqueUsers.includes(x.userId)) return;
        else {
          uniqueUsers.push(x.userId);
          return x;
        }
      });

      let response = [];
      uniqueUserReviews.forEach((review) => {
        if (review) {
          let resp = {
            ...review,
            user: this.filter(review.user, this.blackListedFields),
            listing: {
              ...this.filter(review.listing, this.blackListedFields),
              images: review.listing.images.map((image) => this.filter(image, this.blackListedFields)),
            },
          };
          response.push(resp);
        }
      });
      return { data: response };
    } catch (err) {
      Logger.log('error', 'error fetching all the reviews for this particular listing', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async editUserReview(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);

      Logger.log('info', 'updating the particular review');
      let keysToUpdate = ['rating', 'description'];
      let kvMap = {};
      keysToUpdate.forEach((key) => (kvMap[key] = params[key]));

      let review = await models.review.update(kvMap, {
        where: {
          id: params.id,
          listingId: params.listingId,
          userId: params.userId,
        },
        returning: true,
      });
      return { data: review[1] };
    } catch (err) {
      Logger.log('error', 'error updating user review', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async deleteUserReview(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);

      Logger.log('info', 'deleting the particular user review');

      let deleted = await models.review.destroy({
        where: {
          id: params.id,
          listingId: params.listingId,
          userId: params.userId,
        },
        returning: true,
      });
      if (deleted && deleted.length) return { data: { message: `Successfully deleted the user review !!` } };
      if (deleted && !deleted.length) return { data: { message: `No review found to delete` }, code: 404 };
    } catch (err) {
      Logger.log('error', 'error deleting the  user review', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static filter(dataObject, arrayOfKeysToFilterOut) {
    let resultObj = {};
    let filteredKeys = Object.keys(dataObject).filter((key) => !arrayOfKeysToFilterOut.includes(key));
    filteredKeys.forEach((key) => {
      resultObj[key] = dataObject[key];
    });
    return resultObj;
  }
}

module.exports = ReviewService;
