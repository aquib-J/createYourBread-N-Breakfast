const nodemailer = require('nodemailer');
const { Logger, Response, Message } = require('./../utils');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  logger: false,
  debug: false,
});

const generateMail = ({ from, to, sub, text, html, cc = '', bcc = '' }) => {
  return {
    from: from || `Bread & Breakfast 🏠🌍☕️🍔🍕🍣 🛌 <${process.env.EMAIL}>`,
    to,
    cc,
    bcc,
    subject: sub,
    text, // plain body text
    html:
      html ||
      `<p><b>Hello</b> to Bread & Breakfast 🏠🌍☕️🍔 <img src="cid:note@example.com"/></p>
    <p>Here's a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>`, //multiline html content supported with backticks
  };
};

/* 🏠🌍☕️🍔🍕🍣 🛌  */
class Email {
  static async signupEmail(email) {
    try {
      const config = {
        from: `Bread & Breakfast  <aquib.jansher@gmail.com>`,
        to: email,
        sub: `Welcome to Bread and Breakfast !!`,
        text: 'welcome to our amazing test site',
        html: `<p><b>Hello</b> to Bread & Breakfast 🏠🌍☕️🍔 <img src="cid:note@example.com"/></p>
        <p>Here's a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>`,
      };
      const sentMail = await transporter.sendMail(generateMail(config));
      if (sentMail) return sentMail;
      Response.createError(Message.FailedToSendEmail);
    } catch (err) {
      Logger.log('error', 'error sending signup email', err);
      Response.createError(Message.tryAgain, err);
    }
  }
  static async passwordResetEmail(params) {
    try {
      const config = {
        from: `Bread & Breakfast  <aquib.jansher@gmail.com>`,
        to: params.emailId,
        sub: `Reset Link - Bread and Breakfast !!`,
        text: `Hi user, here's your reset link ${process.env.RESET_URL}${params.resetToken} Valid for an hour`,
      };
      const sentMail = await transporter.sendMail(generateMail(config));
      if (sentMail) Logger.log('info', 'reset email sent successfully', sentMail);
      Response.createError(Message.FailedToSendEmail);
    } catch (err) {
      Logger.log('error', 'error sending email with the reset token', err);
      Response.createError(Message.tryAgain, err);
    }
  }
  static async postResetEmail(params) {
    return;
  }
  static async bookingConfirmationEmail(params) {
    return;
  }
}

module.exports = Email;