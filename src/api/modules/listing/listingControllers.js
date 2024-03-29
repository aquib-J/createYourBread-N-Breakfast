const { Response, Logger } = require('../../../utils');
const { ListingService } = require('../../../services');

class ListingController {
  static async search(req, res) {
    try {
      Logger.log('info', 'searching listings according to various query params');
      const servRes = await ListingService.search(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }

  static async createListing(req, res) {
    try {
      Logger.log('info', 'creating a New Listing');
      const servRes = await ListingService.createListing(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async updateListing(req, res) {
    try {
      Logger.log('info', 'update Listing Information');
      const servRes = await ListingService.updateListing(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async getListingById(req, res) {
    try {
      Logger.log('info', 'fetching all the listings by listing id');
      const servRes = await ListingService.getListingById(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async getListingByUserId(req, res) {
    try {
      Logger.log('info', 'fetching all the listings owned by a user');
      const servRes = await ListingService.getListingByUserId(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async uploadListingImages(req, res) {
    try {
      Logger.log('info', 'uploading the listing images to s3');
      const servRes = await ListingService.uploadListingImages(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async deleteListing(req, res) {
    try {
      Logger.log('info', 'delete the particular listing');
      const servRes = await ListingService.deleteListing(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = ListingController;
