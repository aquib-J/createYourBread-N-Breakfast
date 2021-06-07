const { Logger, Response, Message } = require('./../utils');
const { models } = require('./../loaders/sequelize');
const moment = require('moment');

class UtilityService {
  static async getCountries(params) {
    try {
      const countries = await models.country.findAll();
      if (countries) return { data: countries };
      throw Response.createError(Message.tryAgain);
    } catch (err) {
      Logger.log('error', 'error fetching country', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async getStates(params) {
    try {
      const states = await models.state.findAll({
        where: {
          countryId: params.id,
        },
        raw: true,
        nest: true,
      });
      if (states) return { data: states };
      throw Response.createError(Message.tryAgain);
    } catch (err) {
      Logger.log('error', 'error fetching states', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getCities(params) {
    try {
      const cities = await models.city.findAll({
        where: {
          stateId: params.id,
        },
        raw: true,
        nest: true,
      });
      if (cities) return { data: cities };
      throw Response.createError(Message.tryAgain);
    } catch (err) {
      Logger.log('error', 'error fetching cities', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async calculateTotalBookingCost(params) {
    try {
      let startDate = moment(params.checkInDate);
      let endDate = moment(params.checkOutDate);

      const numberOfDays = endDate.diff(startDate, 'days');

      Logger.log('info', 'fetching per day price of the listing');

      const pricePerDay = await models.listing.findOne({
        attributes: ['pricePerDay'],
        where: {
          id: params.listingId,
        },
        raw: true,
      });

      if (pricePerDay) return parseFloat(pricePerDay.pricePerDay) * numberOfDays;

      throw Response.createError(Message.failedToFetchListingPrice);
    } catch (err) {
      Logger.log('error', 'error in calculationg the total cost', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static dateDiffCalculator(dateA, dateB) {
    // where dateB > dateA
    return moment(dateB).diff(moment(dateA), 'days');
  }

  static async resetListingRatings(params) {
    //TODO: fetch all the bookings for the past week, and all the reviews in the past week and aggregate the ratings for the listing
    // and update the ratings on the particular listing

    // TODO: figure out the exact calculation
    try {
      return;

      throw Response.createError(Message.FailedUpdatingListingRatings);
    } catch (err) {
      Logger.log('error', 'error in updating the Listing ratings', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = UtilityService;
