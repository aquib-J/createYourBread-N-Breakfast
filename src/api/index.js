const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

const { Logger, Response } = require('../utils');

const user = require('./modules/user/userRoutes');
const booking = require('./modules/booking/bookingRoutes');
const listing = require('./modules/listing/listingRoutes');
const review = require('./modules/review/reviewRoutes');
const location = require('./modules/location/locationRoutes');
const bookmark = require('./modules/bookmark/bookmarkRoutes');
// const payment =require('./modules/payment/paymentRoutes'); //TODO: razorpay Integration : possibly might need to change the payment table migration/models

exports.loadRoutes = (app, prefix) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(`${prefix}/v1/user`, user);
  app.use(`${prefix}/v1/booking`, booking);
  app.use(`${prefix}/v1/listing`, listing);
  app.use(`${prefix}/v1/review`, review);
  app.use(`${prefix}/v1/location`, location);
  app.use(`${prefix}/v1/bookmark`, bookmark);
  // app.use(`${prefix}/v1/payment`, payment);

  app.all('/status', (req, res) => {
    const data = {
      service: process.env.SERVICE_NAME,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body,
    };
    Logger.log('info', 'checking bnb backend status', data);
    Response.success(res, 'success', data);
  });
};
