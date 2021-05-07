const { Router } = require('express');
const validation = require('./reviewValidation');
const controller = require('./reviewControllers');

const { PushToBody } = require('./../../middlewares');

const router = Router();

// post a review 
router.post('/', validation.postReview, PushToBody, controller.postReview);

// fetch a review by user Id
router.get('/user/:id', validation.getUserReview, controller.getUserReview);

// fetch a review by listing Id
router.get('/listing/:id', validation.getListingReview, controller.getListingReview);



module.exports = router;
