const { Router } = require('express');
const validation = require('./bookingValidation');
const controller = require('./bookingControllers');
const { PushToBody } = require('./../../middlewares');

const router = Router();

// create a booking
router.post('/', validation.createBooking, controller.createBooking);

// fetch all the bookings done by a user
router.get('/:id',validation.getBooking, controller.getBooking);


// can add API's to locate bookings by paymentId or listingId or checkin/checkout date as and when UI supports or requires

module.exports = router;
