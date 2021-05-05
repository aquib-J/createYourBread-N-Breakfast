const { Router } = require('express');
const validation = require('./listingValidation');
const controller = require('./listingController');
const { Multer } = require('../../../utils');
const { PushToBody } = require('./../../middlewares');
const router = Router();

// search using query params : which contains city for now with pageNo & pageSize as optional values 
router.get('/search', validation.search, PushToBody, controller.search);

// create a new Listing 
router.post('/', validation.createListing, controller.createListing);

// fetch a listing by listing Id
router.get('/:listingId', validation.getListingById, controller.getListingById);

//fetch a listing by user Id (owner of the listing)
router.get('user-id/:userId', validation.getListingByUserId, controller.getListingByUserId);

//upload a users profile pic
router.post('/upload-images', Multer.array('image',5), validation.uploadListingImages, controller.uploadListingImages);

module.exports = router;
