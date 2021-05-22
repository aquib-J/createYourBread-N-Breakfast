const { Router } = require('express');
const validation = require('./listingValidation');
const controller = require('./listingControllers');
const { Multer } = require('../../../utils');
const { PushToBody, Authenticate } = require('./../../middlewares');
const router = Router();

// search using query params : currently supports : ?city='..'&pageNo=''&resultsPerPage=''&upperPriceLimit=''&lowerPriceLimit=''&rating=''
router.get('/search', validation.search, PushToBody, controller.search);

// create a new Listing
router.post('/:userId', validation.createListing, Authenticate.checkSession, PushToBody, controller.createListing);

// fetch all the relevant listing info for a particular listing Id
router.get('/:listingId', validation.getListingById, Authenticate.checkSession, PushToBody, controller.getListingById);

// update the listing information
router.patch(
  '/:userId/:listingId',
  validation.updateListing,
  Authenticate.checkSession,
  PushToBody,
  controller.updateListing,
);
//fetch all listings by user Id (owner of the listing)
router.get(
  '/user-Id/:userId',
  validation.getListingByUserId,
  Authenticate.checkSession,
  PushToBody,
  controller.getListingByUserId,
);

//upload a users profile pic
router.post(
  '/upload-images',
  Authenticate.checkSession,
  Multer.array('images', 5),
  validation.uploadListingImages,
  controller.uploadListingImages,
);

module.exports = router;
