const { Router } = require('express');
const validation = require('./reviewValidation');
const controller = require('./reviewControllers');

const { PushToBody, Authenticate } = require('./../../middlewares');

const router = Router();

// post a review
router.post('/:userId/:listingId', Authenticate.checkSession, validation.postReview, PushToBody, controller.postReview);

// fetch a review by user Id
router.get('/user/:userId', Authenticate.checkSession, validation.getUserReview, PushToBody, controller.getUserReview);

// fetch a review by listing Id
router.get('/listing/:listingId', validation.getListingReview, PushToBody, controller.getListingReview);

router.delete(
  '/:userId/:listingId/:id',
  Authenticate.checkSession,
  validation.deleteUserReview,
  PushToBody,
  controller.deleteUserReview,
);

router.patch('/:userId/:listingId/:id', Authenticate.checkSession, PushToBody, controller.editUserReview);

module.exports = router;
