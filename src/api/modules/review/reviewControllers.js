const { Response, Logger } = require('../../../utils');
const { ReviewService } = require('../../../services');

class ReviewController {
  static async postReview(req, res) {
    try {
      Logger.log('info', 'creating a fresh review');
      const servRes = await ReviewService.createReview(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }

  static async getUserReview(req, res) {
    try {
      Logger.log('info', 'fetching reviews by the user');
      const servRes = await ReviewService.getUserReviews(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async getListingReview(req, res) {
    try {
      Logger.log('info', 'fetching all reviews for a listing');
      let params = { body: req.body, id: req.params.id };
      const servRes = await ReviewService.getListingReviews(params);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async deleteUserReview(req, res) {
    try {
      Logger.log('info', 'deleting the current review');
      const servRes = await ReviewService.deleteUserReview(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async editUserReview(req, res) {
    try {
      Logger.log('info', 'patching the current review');
      const servRes = await ReviewService.editUserReview(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = ReviewController;
