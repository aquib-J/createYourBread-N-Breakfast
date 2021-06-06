const { Router } = require('express');
const validation = require('./paymentValidation');
const controller = require('./paymentControllers');
const { PushToBody } = require('./../../middlewares');
const router = Router();

// page to test out the payment Integration locally
router.get('/test-razorpay', controller.loadStaticTestPage);

// create an order, capture the order details(ORDER-ID/transaction-Id) and forward the order Id and other credentials to the FE
router.post('/order', validation.createPaymentOrder, controller.createPaymentOrder);

router.post('/verify', validation.verifyPaymentSignature, controller.verifyPaymentSignature);

router.post('/capture', controller.processWebHook);

router.post('/refund/:gatewayPaymentId', PushToBody, controller.refundPayment);

router.get('/status/:paymentId', PushToBody, controller.getPaymentStatus);

// test route : to not be used directly
// router.get('/:orderId', PushToBody, controller.fetchAllPayments);

module.exports = router;
