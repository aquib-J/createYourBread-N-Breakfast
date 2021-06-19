const { Router } = require('express');
const validation = require('./listingValidation');
const controller = require('./listingControllers');
const { Multer } = require('../../../utils');
const { PushToBody, Authenticate } = require('./../../middlewares');
const router = Router();

// search using query params : currently supports : ?city='..'&pageNo=''&resultsPerPage=''&upperPriceLimit=''&lowerPriceLimit=''&rating=''
router.get('/search', validation.search, PushToBody, controller.search);

// create a new Listing
router.post('/:userId', Authenticate.checkSession, validation.createListing, PushToBody, controller.createListing);

// fetch all the relevant listing info for a particular listing Id
router.get('/:listingId', validation.getListingById, PushToBody, controller.getListingById);

// update the listing information
router.patch(
  '/:userId/:listingId',
  Authenticate.checkSession,
  validation.updateListing,
  PushToBody,
  controller.updateListing,
);
//fetch all listings by user Id (owner of the listing)
router.get(
  '/host/:userId',
  Authenticate.checkSession,
  validation.getListingByUserId,
  PushToBody,
  controller.getListingByUserId,
);

//upload the listing pictures
router.post(
  '/:userId/upload',
  Authenticate.checkSession,
  validation.uploadListingImages,
  Multer.array('images', 5),
  PushToBody,
  controller.uploadListingImages,
);

router.delete(
  '/:userId/:listingId',
  Authenticate.checkSession,
  validation.deleteListing,
  PushToBody,
  controller.deleteListing,
);

module.exports = router;
