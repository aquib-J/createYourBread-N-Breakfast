const { Op } = require('sequelize');
const { models } = require('../loaders/sequelize');
const { Logger, Response, Message } = require('../utils');
const { Razorpay } = require('./../utils');
const { razorpayConfig } = require('./../config');
const crypto = require('crypto');
const Redis = require('../loaders/redis');

class PaymentService {
  static async createPaymentOrder(params) {
    try {
      if (params.currency === 'INR') {
        params.amount = params.amount * 100;
      }
      const data = await Razorpay.orders.create(params);
      if (data) {
        Logger.log('info', 'data returned from razorpay :', data);
        Logger.log('info', 'creating entry in payment table with the amount,bookingId and orderId respectively');
        const payment = models.payment.create({
          gatewayOrderId: data.id,
          bookingId: data.receipt,
          amount: parseFloat(parseFloat(data.amount) / 100),
        });
        return { data: { order: data, payment: payment.get({ plain: true }) } };
      } else throw Response.createError(Message.FailedToCreatePaymentOrder);
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
      let { headers, body } = params;

      let exists = await Redis.get(headers[`x-razorpay-signature`]); // to avoid processing duplicate webhooks
      if (exists) {
        Logger.log('info', 'ignoring the payload as the same has already been consumed and processed');
        return;
      }

      Logger.log('info', 'received webhook for :', body.event);
      const signature = crypto
        .createHmac('sha256', razorpayConfig.webhookSecret)
        .update(JSON.stringify(body))
        .digest('hex');

      if (signature === headers[`x-razorpay-signature`]) {
        Logger.log('info', 'signature successfully verified for the payment : ', body.payload.payment.entity.id);
        switch (body.event) {
          case 'payment.failed': {
            Redis.set(headers[`x-razorpay-signature`], 'exists', 300);
            await Promise.all([
              models.payment.update(
                {
                  gatewayPaymentId: body.payload.payment.entity.id,
                  paymentStatus: 'FAILED',
                },
                {
                  where: {
                    gatewayOrderId: body.payload.payment.entity.order_id,
                  },
                },
              ),
              models.razorwebhook.create({
                eventType: body.event,
                payload: body,
                headers: headers,
                paymentId: body.payload.payment.entity.id,
                orderId: body.payload.payment.entity.order_id,
              }),
            ]);
            break;
          }
          case 'order.paid': {
            Redis.set(headers[`x-razorpay-signature`], 'exists', 300);
            await models.razorwebhook.create({
              eventType: body.event,
              payload: body,
              headers: headers,
              paymentId: body.payload.payment.entity.id,
              orderId: body.payload.payment.entity.order_id,
            });
            break;
          }
          case 'payment.captured': {
            Redis.set(headers[`x-razorpay-signature`], 'exists', 300);
            let [payment, _] = await Promise.all([
              models.payment.findOne({
                where: {
                  gatewayOrderId: body.payload.payment.entity.order_id,
                },
              }),
              models.razorwebhook.create({
                eventType: body.event,
                payload: body,
                headers: headers,
                paymentId: body.payload.payment.entity.id,
                orderId: body.payload.payment.entity.order_id,
              }),
            ]);
            payment.get({ plain: true }); // due to payment having an unique index on bookingId at the time of writing this
            await models.payment.destroy({
              where: {
                gatewayPaymentId: payment.gatewayPaymentId,
              },
            });
            let newPayment = await models.payment.create({
              bookingId: payment.bookingId,
              amount: payment.amount,
              gatewayPaymentId: body.payload.payment.entity.id,
              gatewayOrderId: body.payload.payment.entity.order_id,
              paymentStatus: 'SUCCESS',
            });
            newPayment.get({ plain: true });

            await models.booking.update(
              {
                paymentId: newPayment.id,
              },
              {
                where: {
                  id: newPayment.bookingId,
                },
              },
            );
            break;
          }
          case 'refund.created': {
            Redis.set(headers[`x-razorpay-signature`], 'exists', 300);
            await models.razorwebhook.create({
              eventType: body.event,
              payload: body,
              headers: headers,
              paymentId: body.payload.refund.entity.payment_id,
              orderId: body.payload.payment.entity.order_id,
              refundId: body.payload.refund.entity.id,
            });
            break;
          }
          case 'refund.processed': {
            Redis.set(headers[`x-razorpay-signature`], 'exists', 300);
            await Promise.all([
              models.payment.update(
                {
                  gatewayRefundId: body.payload.refund.entity.id,
                  paymentStatus: 'REFUNDED',
                },
                {
                  where: {
                    gatewayPaymentId: body.payload.refund.entity.payment_id,
                  },
                },
              ),
              models.razorwebhook.create({
                eventType: body.event,
                payload: body,
                headers: headers,
                paymentId: body.payload.refund.entity.payment_id,
                orderId: body.payload.payment.entity.order_id,
                refundId: body.payload.refund.entity.id,
              }),
            ]);
            break;
          }
          default: {
            Logger.log('info', 'unrecognised event type', body.event);
            break;
          }
        }
      } else {
        Logger.log(
          'info',
          'failed to verify the signature of the payment, hence dropping the payload for the payment:',
          body.payload.entity.id,
        );
        throw Response.createError(Message.paymentFailedToVerify);
      }
    } catch (err) {
      Logger.log('error', 'error in processing webhook', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }

  static async fetchAllPayments(params) {
    try {
      const response = await Razorpay.orders.fetchPayments(params.orderId);
      return { data: response };
    } catch (err) {
      Logger.log('error', 'error in fetching the payments for the orderId', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async refundPayment(params) {
    try {
      const response = await Razorpay.payments.refund(params.gatewayPaymentId);
      return { data: response };
    } catch (err) {
      Logger.log('error', 'error in refunding payment', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
  static async getPaymentStatus(params) {
    try {
      Logger.log('info', 'fetching payment status');
      const status = await models.payment.findOne({
        attributes: ['paymentStatus'],
        where: {
          id: params.paymentId,
        },
      });
      if (status) return { data: status.get({ plain: true }) };
      else throw Response.createError({ message: `payment not found` });
    } catch (err) {
      Logger.log('error', 'error in fetching payment status', err);
      throw Response.createError(Message.tryAgain, err);
    }
  }
}

module.exports = PaymentService;
