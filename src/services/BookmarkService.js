const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('./../utils');

class BookmarkService {
  static async createBookmark(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);

      Logger.log('info', 'checking for Idempotency');
      let bookmark = await models.bookmark.findOne({
        where: {
          [Op.and]: {
            listingId: params.listingId,
            userId: params.userId,
          },
        },
      });
      if (bookmark) throw Response.createError(Message.bookmarkExists);

      bookmark = await models.bookmark.create({
        listingId: params.listingId,
        userId: params.userId,
      });

      return { data: bookmark.get({ plain: true }) };
    } catch (err) {
      Logger.log('error', 'error in creating the bookmark', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async getBookmark(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);
      Logger.log('info', 'fetching all the bookmarks for the user');
      let bookmark = await models.bookmark.findAll({
        where: {
          userId: params.userId,
        },
        include: [
          {
            model: models.listing,
            attributes: ['id', 'listingName', 'pricePerDay', 'address', 'description', 'avgRating', 'status'],
            include: [
              {
                model: models.city,
                attributes: ['cityName'],
                include: [
                  {
                    model: models.state,
                    attributes: ['stateName'],
                    include: [
                      {
                        model: models.country,
                        attributes: ['countryName'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (bookmark && bookmark.length) return { data: bookmark };

      return { data: { message: 'no bookmark found for the user' }, code: 404 };
    } catch (err) {
      Logger.log('error', 'error fetching the specific bookmark', err);
      Response.createError(Message.tryAgain, err);
    }
  }

  static async deleteBookmark(params) {
    try {
      if (params.session.userId !== params.userId) throw Response.createError(Message.InconsistentCredentials);

      Logger.log('info', 'deleting the particular bookmark review');

      let deleted = await models.bookmark.destroy({
        where: {
          id: params.bookmarkId,
          userId: params.userId,
        },
        returning: true,
      });
      if (deleted && deleted.length) return { data: { message: `Successfully deleted the bookmark !!` } };
      if (deleted && !deleted.length) return { data: { message: `No bookmark found to delete` }, code: 404 };
    } catch (err) {
      Logger.log('error', 'error deleting the specific bookmark ', err);
      Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = BookmarkService;
