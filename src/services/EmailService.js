const nodemailer = require('nodemailer');
const { Logger, Response, Message } = require('./../utils');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  logger:true,
  debug:true,
});

const generateMail = ({from, to, sub, text, html, cc = '', bcc = ''}) => {
  return {
    from: from || `Bread & Breakfast 🏠🌍☕️🍔🍕🍣 🛌 <${process.env.EMAIL}>`,
    to,
    cc,
    bcc,
    subject: sub,
    text, // plain body text
    html=html || `<p><b>Hello</b> to Bread & Breakfast 🏠🌍☕️🍔 <img src="cid:note@example.com"/></p>
    <p>Here's a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>`, //multiline html content supported with backticks
  };
};

class Email {
    /**
   *
   * @param {Object} params
   * @param {Object} params.features
   * @param {number} params.cityId
   * @param {number} params.pricePerDay
   * @param {Array[Object]} params.listingImages
   * @param {string} params.listingImages.url
   * @param {Object} params.listingImages.metadata
   * @returns {Promise<void>}
   */
  static async signupEmail(params) {
    try{
    const config={
        from: `Bread & Breakfast 🏠🌍☕️🍔🍕🍣 🛌 <aquib.jansher@gmail.com>`,
        to:params.email,

    }
    const sentMail = await transporter.sendMail(generateMail(config));
    return sentMail;
    }catch(err){
        Logger.log('error',Message.tryAgain,err);
        Response.createError(Message.tryAgain,err);
    }
  }
  static async passwordResetEmail(params) {
    return;
  }
  static async postResetEmail(params) {
    return;
  }
  static async bookingConfirmationEmail(params) {
    return;
  }
}

module.exports = Email;
