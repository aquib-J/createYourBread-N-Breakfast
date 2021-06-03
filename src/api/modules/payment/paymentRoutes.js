const { Router } = require('express');
const validation = require('./paymentValidation');
const controller = require('./paymentControllers');
const { PushToBody } = require('./../../middlewares');
const router = Router();

// page to test out the payment Integration locally
router.get('/test-razorpay', controller.loadStaticTestPage);

// create an order, capture the order details(ORDER-ID/transaction-Id) and forward the order Id and other credentials to the FE
router.post('/order', validation.createPaymentOrder, controller.createPaymentOrder);

// signs up and creates a user : email id is unique
router.post('/verify', validation.verifyPaymentSignature, controller.verifyPaymentSignature);

router.post('/capture', validation.processWebHook, controller.processWebHook);

router.post('/cancel', validation.refundPayment, controller.refundPayment);

module.exports = router;
