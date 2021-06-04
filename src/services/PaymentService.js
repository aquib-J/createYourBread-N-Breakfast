const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const { Razorpay } = require('./../utils');
const { razorpayConfig } = require('./../config');
const crypto = require('crypto');

class PaymentService {
  static async createPaymentOrder(params) {
    try {
      const data = await Razorpay.orders.create(params);
      if (data) {
        Logger.log('info', 'data returned from razorpay :', data);
        return { data };
      } else throw Response.createError({ message: 'failed to create order' });
    } catch (err) {
      Logger.log('error', 'error in creating payment order', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async verifyPaymentSignature(params) {
    try {
      const signature = params.razorpay_order_id + '|' + params.razorpay_payment_id;

      const hashedSignature = crypto
        .createHmac('sha256', razorpayConfig.keySecret)
        .update(signature.toString())
        .digest('hex');

      if (params.razorpay_signature === hashedSignature) {
        return { status: 'success', message: 'signature successfully verified' };
      } else throw Response.createError(Message.paymentFailedToVerify);
    } catch (err) {
      Logger.log('error', 'error in verifying payment signature', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async processWebHook(params) {
    try {
      return;
    } catch (err) {
      Logger.log('error', 'error in processing webhook', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async refundPayment(params) {
    try {
      return;
    } catch (err) {
      Logger.log('error', 'error in refunding payment', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = PaymentService;
