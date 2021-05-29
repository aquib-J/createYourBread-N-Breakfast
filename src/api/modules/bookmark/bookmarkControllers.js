const { Response, Logger } = require('../../../utils');
const { BookmarkService } = require('../../../services');

class BookmarkController {
  static async createBookmark(req, res) {
    try {
      Logger.log('info', 'creating a bookmark for the user');
      const servRes = await BookmarkService.createBookmark(req.body);
      Response.success(res, servRes);
    } catch (err) {
      console.log('here')
      Response.fail(res, err);
    }
  }
  static async getBookmark(req, res) {
    try {
      Logger.log('info', 'fetching all the bookmarks for the user');
      const servRes = await BookmarkService.getBookmark(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async deleteBookmark(req, res) {
    try {
      Logger.log('info', 'deleting the specific bookmark');
        const servRes = await BookmarkService.deleteBookmark(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = BookmarkController;
