const { Router } = require('express');
const validation = require('./bookmarkValidation');
const controller = require('./bookmarkControllers');
const { PushToBody, Authenticate } = require('./../../middlewares');
const router = Router();

// create a fresh bookmark
router.post(
  '/:userId/:listingId/create',
  Authenticate.checkSession,
  validation.createBookmark,
  PushToBody,
  controller.createBookmark,
);

// fetch all the bookmarks for a user
router.get('/:userId', Authenticate.checkSession, validation.getBookmark, PushToBody, controller.getBookmark);

// delete a specific bookmark for a user
router.delete('/:userId/:bookmarkId', Authenticate.checkSession, validation.deleteBookmark, PushToBody, controller.deleteBookmark);

module.exports = router;
