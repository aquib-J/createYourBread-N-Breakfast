const { image } = require('faker');
const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');

class ListingService {
  static async search(params) {
    try {
      return;
    } catch (err) {
      Logger.log('error', 'error searching for Listings', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  /**
   *
   * @param {Object} params
   * @param {Object} params.features
   * @param {number} params.cityId
   * @param {number} params.pricePerDay
   * @param {Array[Object]} params.listingImages
   * @param {string} params.listingImages.url
   * @param {Object} params.listingImages.metadata
   * @returns {Promise<void>}
   */
  static async createListing(params) {
    try {
      Logger.log('info', 'checking duplicate listing with same name');

      let listing = await models.listing.findOne({
        attributes: ['listingName'],
        where: {
          listingName: params.listingName,
        },
      });
      if (listing) throw Response.createError(Message.ListingNameExists);

      Logger.log('info', 'creating new Listing db record');

      let listingObj = {
        listingName: params.listingName,
        userId: params.userId,
        pricePerDay: params.pricePerDay,
        address: params.address,
        description: params.description,
        cityId: params.cityId,
        features: params.features,
      };

      listing = await models.listing.create(listingObj);

      listing.get({ plain: true });
      const listingId = listing.id;

      if (params.listingImages && params.listingImages.length) {
        let imageArray = params.listingImages.map((image) => {
          let imageObj = {
            listingId,
            url: image.url,
            metadata: image.metadata,
          };
          return imageObj;
        });

        Logger.log('info', 'creating corresponding image records');
        await models.image.bulkCreate(imageArray);

        const resObj = await models.listing.findOne({
          where: {
            id: listingId,
          },
          include: [
            {
              model: models.image,
            },
          ],
          nested: true,
        });

        return { data: resObj };
      }
      listing.listingImages = [];
      return { data: listing };
    } catch (err) {
      Logger.log('error', 'error fetching user details', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getListingById(params) {
    try {
      Logger.log('info', 'querying db for listing');
      const listing = await models.listing.findOne({
        where: {
          id: params.id,
        },
        include: [
          {
            model: models.city,
          },
          {
            model: models.image,
          },
        ],
        raw: true,
      });
      if (user) return { data: user };
      throw Response.createError(Message.userNotFound);
    } catch (err) {
      Logger.log('error', 'error fetching user details', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getListingByUserId(params) {
    try {
      Logger.log('info', 'getting user');
      const user = await models.user.findOne({
        attributes: ['id', 'firstName', 'lastName', 'bio', 'emailId', 'dob', 'profilePictureUrl', 'updatedAt'],
        where: {
          id: params.id,
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
  static async uploadListingImages(params) {
    try {
      Logger.log('info', 'getting user');
      const user = await models.user.findOne({
        attributes: ['id', 'firstName', 'lastName', 'bio', 'emailId', 'dob', 'profilePictureUrl', 'updatedAt'],
        where: {
          id: params.id,
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
}

module.exports = ListingService;
