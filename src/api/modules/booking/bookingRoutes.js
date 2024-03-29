const { Router } = require('express');
const validation = require('./bookingValidation');
const controller = require('./bookingControllers');
const { PushToBody, Authenticate } = require('./../../middlewares');

const router = Router();

// create a booking
router.post('/:userId', Authenticate.checkSession, validation.createBooking, PushToBody, controller.createBooking);

// fetch all the bookings done by a user
router.get('/user/:userId', Authenticate.checkSession, validation.getBooking, PushToBody, controller.getBooking);


// TODO: flexible booking are not implemented as of now 
// router.patch('/:userId/:bookingId', Authenticate.checkSession, validation.updateBooking, PushToBody, controller.updateBooking);

router.delete('/cancel/:userId/:bookingId', Authenticate.checkSession, validation.cancelBooking, PushToBody, controller.cancelBooking);


// TODO: add API's to locate bookings by paymentId or listingId or checkin/checkout date as and when UI supports or requires
/**
 * /listing/:id
 *
 * /payment/:id
 *
 * &checkinDate>=''&checkoutDate<=''
 *
 */
module.exports = router;
