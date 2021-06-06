const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const UtilityService = require('./UtilityService');
const moment = require('moment');

class BookingService {
  static async createBooking(params) {
    if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
    try {
      let cost = 0;
      let obj = {};
      const today = moment().format('YYYY-MM-DD');
      if (
        !(moment(params.checkInDate).diff(today, 'days') > 0) ||
        !(moment(params.checkOutDate).diff(today, 'days') > 0)
      )
        throw Response.createError(Message.cannotBookInThePastOrToday);

      Logger.log('info', 'checking if the Listing is already booked for the current dates');
      let booking = await models.booking.findAll({
        where: {
          [Op.and]: [
            {
              listingId: params.listingId,
              status: 'BOOKED',
              [Op.or]: [
                {
                  [Op.and]: [
                    { checkOutDate: { [Op.gte]: params.checkInDate } },
                    { checkInDate: { [Op.lte]: params.checkOutDate } },
                  ],
                },
                {
                  [Op.and]: [
                    { checkOutDate: { [Op.lte]: params.checkInDate } },
                    { checkInDate: { [Op.gte]: params.checkOutDate } },
                  ],
                },
              ],
            },
          ],
        },
      });

      if (booking.length) throw Response.createError(Message.listingAlreadyBooked);

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
        totalPrice: cost,
      });
      return { data: booking.get({ plain: true }) };
    } catch (err) {
      Logger.log('error', 'error creating user ', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async getBooking(params) {
    if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
    try {
      Logger.log('info', 'getting all the bookings for the user');
      const user = await models.booking.findAll({
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
        order: [['checkOutDate', 'DESC']],
      });
      if (user && user.length) return { data: user };
      throw Response.createError(Message.BookingNotFound);
    } catch (err) {
      Logger.log('error', 'error fetching bookings for the user', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async updateBooking(params) {
    try {
      return;
    } catch (err) {
      Logger.log('error', 'error updating booking for the user', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async cancelBooking(params) {
    if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);

    try {
      const [update, booking] = await Promise.all([
        models.booking.update(
          {
            status: 'CANCELLED',
          },
          {
            where: {
              id: params.bookingId,
            },
          },
        ),
        models.booking.findOne({
          attributes: [],

          include: [
            {
              model: models.payment,
              attributes: ['gatewayPaymentId'],
            },
          ],
        }),
      ]);
      if (update && booking) return { data: booking.get({ plain: true }) };
      else {
        return {
          message: `The booking is cancelled ,but no payment found for the booking`,
        };
      }
    } catch (err) {
      Logger.log('error', 'error cancelling booking for the user', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = BookingService;
