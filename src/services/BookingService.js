const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const UtilityService = require('./UtilityService');
const moment = require('moment');

let dd = UtilityService.dateDiffCalculator;
class BookingService {
  static async createBooking(params) {
    try {
      let cost = 0;
      let obj = {};
      Logger.log('info', 'checking if the Listing is already booked for the current dates');
      let booking = await models.booking.findOne({
        where: {
          [Op.and]: [
            {
              listingId: params.listingId,
              [Op.and]: [
                { checkInDate: { [Op.gte]: params.checkInDate } },
                { checkOutDate: { [Op.lte]: params.checkOutDate } },
              ],
            },
          ],
        },
      });

      if (booking) {
        booking.get({ plain: true });
        // 4 + 2 possible cases of slot timings collision eliminated

        if (
          (dd(booking.checkInDate, params.checkInDate) >= 0 && dd(params.checkOutDate, booking.checkOutDate) >= 0) ||
          (dd(booking.checkInDate, params.checkInDate) <= 0 && dd(params.checkOutDate, booking.checkOutDate) <= 0) ||
          (dd(booking.checkInDate, params.checkInDate) <= 0 && dd(params.checkOutDate, booking.checkOutDate) >= 0) ||
          (dd(booking.checkInDate, params.checkInDate) >= 0 && dd(params.checkOutDate, booking.checkOutDate) <= 0)
        ) {
          throw Response.createError(Message.listingAlreadyBooked);
        }
      }
      obj.checkInDate = params.checkInDate;
      obj.checkOutDate = params.checkOutDate;
      obj.listingId = params.listingId;

      Logger.log('info', 'calculating the total price for the booking');

      cost = await UtilityService.calculateTotalBookingCost(obj);

      Logger.log('info', 'inserting entry into the booking table');

      booking = await models.booking.create({
        userId: params.userId,
        listingId: params.listingId,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        totalPrice: cost || params.totalPrice,
      });
      return { data: booking.get({ plain: true }) };
    } catch (err) {
      Logger.log('error', 'error creating user ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async getBooking(params) {
    try {
      Logger.log('info', 'getting all the bookings for the user');
      const user = await models.booking.findAll({
        where: {
          userId: params.id,
        },
        raw: true,
      });
      if (user) return { data: user };
      throw Response.createError(Message.BookingNotFound);
    } catch (err) {
      Logger.log('error', 'error fetching bookings for the user', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = BookingService;
