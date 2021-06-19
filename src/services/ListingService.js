const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const Redis = require('../loaders/redis');

class ListingService {
  static async deleteListing(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
      Logger.log('info', 'deleting the particular listing from the DB');
      const deleted = await models.listing.destroy({
        where: {
          [Op.and]: {
            id: params.listingId,
            userId: params.userId,
          },
        },
        returning: true,
      });
      if (deleted && deleted.length) return { data: { message: `Successfully deleted the particular listing !!` } };
      if (deleted && !deleted.length) return { data: { message: `No such listing found to delete` }, code: 404 };
    } catch (err) {
      Logger.log('error', 'error deleting the  user review', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async updateListing(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);

      const allowed = {
        l1: ['listingName', 'pricePerDay', 'address', 'description'],
        l2: ['beds', 'bedroom', 'policies', 'amenities', 'bathrooms'],
        filteredOutput: ['listingName', 'pricePerDay', 'address', 'description', 'features'],
      };

      let listing = await models.listing.findOne({
        where: {
          id: params.listingId,
          userId: params.userId,
        },
      });

      if (!listing) throw Response.createError(Message.FailedToFindListing);

      listing = JSON.parse(JSON.stringify(listing));

      let updatedObj = {};
      let updatedFeatures = Object.assign({}, listing.features);
      updatedFeatures.policies = Object.assign({}, listing.features.policies);
      updatedFeatures.amenities = Object.assign([], listing.features.amenities);
      Object.keys(listing).forEach((key) => {
        if (allowed.l1.includes(key)) {
          updatedObj[key] = params[key];
        }
      });

      Object.keys(listing.features).forEach((key) => {
        if (allowed.l2.includes(key)) {
          if (!['policies', 'amenities'].includes(key)) {
            updatedFeatures[key] = params['features'][key];
          }
          if (key === 'policies') {
            updatedFeatures[key] = Object.assign({}, updatedFeatures[key], params['features'][key]);
          }
          if (key === 'amenities' && params['features'][key] !== null) {
            if (typeof params['features'][key] === 'string') {
              updatedFeatures[key].push(params['features'][key]);
            } else if (typeof params['features'][key] === 'object' && params['features'][key].length) {
              updatedFeatures[key].push(...params['features'][key]);
            }
            updatedFeatures[key] = Array.from(new Set(updatedFeatures[key]));
          }
        }
      });

      updatedObj.features = Object.assign({}, updatedFeatures);

      Logger.log('info', 'applying the selected updates to the listing', updatedObj);

      let listingUpdates = await models.listing.update(updatedObj, {
        where: {
          id: params.listingId,
          userId: params.userId,
        },
        returning: true,
      });

      let rawResponse = JSON.parse(JSON.stringify(listingUpdates[1][0]));

      let response = Object.keys(rawResponse)
        .filter((key) => allowed.filteredOutput.includes(key))
        .reduce((outputObj, key) => {
          outputObj[key] = rawResponse[key];
          return outputObj;
        }, {});

      return { data: response };
    } catch (err) {
      Logger.log('error', 'error updating Listing', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  /**
   * 
   * "queryObj": {
      "city": "",
      "pageNo": "1",
      "resultsPerPage": "10",
      "lowerPriceLimit": "5000",
      "upperPriceLimit": "15000",
      "ratings":''
      "sortBy":ENUM[ratings,price,updatedAt]
    }  
   *  
   */
  static async search(params) {
    try {
      Logger.log('info', 'fetching all the listings matching the required query params');

      let filteredQueryArray = [];
      Object.keys(params).forEach((key) => {
        if (['cookie', 'session'].includes(key)) return;
        else filteredQueryArray.push(key);
      });

      let queryObj = {};
      filteredQueryArray.forEach((key) => {
        queryObj[key] = params[key];
      });

      let fieldMap = {
        ratings: 'avgRating',
        price: 'pricePerDay',
        updatedAt: 'updatedAt',
      };

      let limit = queryObj.resultsPerPage;

      let offset = (queryObj.pageNo - 1) * queryObj.resultsPerPage;

      const listings = await models.listing.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'userId', 'cityId'] },
        order: [[fieldMap[queryObj.sortBy], 'DESC']],
        limit,
        offset,
        where: {
          [Op.and]: {
            status: {
              [Op.eq]: 'AVAILABLE',
            },
            pricePerDay: {
              [Op.and]: {
                [Op.gt]: parseFloat(queryObj.lowerPriceLimit),
                [Op.lt]: parseFloat(queryObj.upperPriceLimit),
              },
            },
            avgRating: {
              [Op.gte]: parseInt(queryObj.ratings),
            },
          },
        },
        include: [
          {
            model: models.city,
            attributes: ['cityName'],
            where: {
              cityName: queryObj.city,
            },
            required: true,
          },
          {
            model: models.image,
            attributes: ['url'],
          },
        ],
        nested: true,
      });
      return { data: listings };
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
   * @param {string} params.userId
   * @param {number} params.pricePerDay
   * @param {Array[Object]} params.listingImages
   * @param {string} params.listingImages.url
   * @param {Object} params.listingImages.metadata
   * @returns {Promise<void>}
   */
  /*
  TODO: note # current flow is to 
        1. upload images
        2. create listing with the Image url obtained in the response to (1)

        Ideally : we should trace the entire process of listing creation in phases

        so , the whole process of onboarding a normal user into a host who has listed his place

        should be in steps , so that the user can check into the listing creation flow anytime and push onto the 
        sequence of steps and then finally complete the whole transition

        sort of like how zerodha or any payment application completes KYC and onboarding
  
  */
  static async createListing(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
      Logger.log('info', 'checking duplicate listing with same name');
      //TODO: create a unique index on [listingName & city] and update this query to include a check with city as well
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
      Logger.log('info', 'querying db to locate listing by listing Id');
      const listing = await models.listing.findOne({
        where: {
          id: params.listingId,
        },
        include: [
          {
            model: models.city,
            include: [{ model: models.state, include: [{ model: models.country }] }],
          },
          {
            attributes: ['id', 'firstName', 'lastName', 'bio', 'emailId', 'dob', 'profilePictureUrl'],
            model: models.user,
          },
          {
            model: models.image,
          },
          {
            model: models.bookmark,
          },
          {
            model: models.booking,
          },
          {
            model: models.review,
            include: [
              {
                attributes: ['id', 'firstName', 'lastName', 'bio', 'emailId', 'dob', 'profilePictureUrl'],
                model: models.user,
              },
            ],
          },
        ],
        // nested:true,
      });
      if (listing) return { data: listing };
      throw Response.createError(Message.FailedToFindListing);
    } catch (err) {
      Logger.log('error', 'error fetching listing details', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getListingByUserId(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);

      let userHostedListings = await Redis.get(`${params.userId}HostedListings`);

      if (userHostedListings) return { data: userHostedListings };

      Logger.log('info', 'getting all the listings for this particular User');
      const listings = await models.listing.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'cityId', 'userId'] },
        include: [
          {
            model: models.image,
            attributes: { exclude: ['id', 'listingId', 'createdAt', 'updatedAt', 'deletedAt'] },
          },
          {
            model: models.city,
            attributes: { exclude: ['stateId', 'createdAt', 'updatedAt', 'deletedAt', 'id'] },

            include: [
              {
                model: models.state,
                attributes: { exclude: ['countryId', 'createdAt', 'updatedAt', 'deletedAt', 'id'] },

                include: [
                  {
                    model: models.country,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'id'] },
                  },
                ],
              },
            ],
          },
        ],
        where: {
          userId: params.userId,
        },
      });
      if (listings && listings.length) {
        Redis.set(`${params.userId}HostedListings`, listings, 2 * 3600);
        return { data: listings };
      }
      throw Response.createError(Message.FailedToFindListing);
    } catch (err) {
      Logger.log('error', 'error fetching listing details', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async uploadListingImages(params) {
    try {
      Logger.log('info', 'sending back the listing s3 urls');

      let imageArray = params.images.map((image) => image.location);
      //TODO: make the bucket private and only return signed Urls and cache it for the similar duration

      return { data: imageArray, message: 'Successfully uploaded these listing images' };
    } catch (err) {
      Logger.log('error', 'error uploading listing Images', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = ListingService;
