const { Response, Logger } = require('../../../utils');
const { razorpayConfig } = require('../../../config');
const { PaymentService } = require('./../../../services');

class PaymentController {
  static async loadStaticTestPage(req, res) {
    try {
      Logger.log('info', 'rendering the payment test page');
      res.render('test-payment', { key: razorpayConfig.keyId });
    } catch (err) {
      Logger.log('error', 'error in rendering the static payment Page', err);
      Response.fail(res, err);
    }
  }
  static async createPaymentOrder(req, res) {
    try {
      Logger.log('info', 'initializing payment order creation');
      const servRes = await PaymentService.createPaymentOrder(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async verifyPaymentSignature(req, res) {
    try {
      Logger.log('info', 'verifying the payment signature for the checkout payload return');
      const servRes = await PaymentService.verifyPaymentSignature(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async processWebHook(req, res) {
    try {
      Logger.log('info', 'in goes the webhook payload');
      PaymentService.processWebHook(req);
      Response.success(res);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async refundPayment(req, res) {
    try {
      Logger.log('info', 'initiating payment refund flow');
      const servRes = await PaymentService.refundPayment(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async fetchAllPayments(req, res) {
    try {
      Logger.log('info', 'fetching all the payments for an order ID');
      const servRes = await PaymentService.fetchAllPayments(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
  static async getPaymentStatus(req, res) {
    try {
      Logger.log('info', 'fetching the status for the payment Id');
      const servRes = await PaymentService.getPaymentStatus(req.body);
      Response.success(res, servRes);
    } catch (err) {
      Response.fail(res, err);
    }
  }
}

module.exports = PaymentController;
