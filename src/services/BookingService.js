const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const UtilityService = require('./UtilityService');

class BookingService {
  static async createBooking(params) {
    //TODO: factor in payment Id while booking and also factor in status while doing an initial check
    try {
      let cost = 0;
      let obj = {};
      Logger.log('info', 'checking if the Listing is already booked for the current dates');
      let booking = await models.booking.findAll({
        where: {
          [Op.and]: [
            {
              listingId: params.listingId,
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
      if (user) return { data: user };
      throw Response.createError(Message.BookingNotFound);
    } catch (err) {
      Logger.log('error', 'error fetching bookings for the user', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = BookingService;
