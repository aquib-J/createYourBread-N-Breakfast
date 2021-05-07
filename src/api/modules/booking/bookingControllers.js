const { Response, Logger } = require('../../../utils');
const { BookingService } = require('../../../services');

class BookingController {
  static async createBooking(req, res) {
    try {
      Logger.log('info', 'creating a new Booking');
      const servRes = await BookingService.createBooking(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }

  static async getBooking(req, res) {
    try {
      Logger.log('info', `fetching booking information for ${req.path.split('/')[2]} id`);
      const servRes = await BookingService.getBooking(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = BookingController;
