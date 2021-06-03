const Razorpay = require('razorpay');
const {
  razorpayConfig: { keyId: key_id, keySecret: key_secret },
} = require('../../config');

const razorpay = new Razorpay({
  key_id,
  key_secret,
});


module.exports = razorpay;