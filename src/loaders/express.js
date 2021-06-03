// meat of the entire express project middleware pipeline

const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const { Logger, Response, AccessLog } = require('../utils');
const { errors, isCelebrateError } = require('celebrate');
const morgan = require('morgan');
const helmet = require('helmet');
const { StatusCodes } = require('http-status-codes');
const { prefix } = require('./../config/index').api;

const connectRedis = require('connect-redis');
const redisClient = require('./redis');
const session = require('express-session');

const RedisStore = connectRedis(session);

const router = require('../api');

exports.loadModules = ({ app }) => {
  /**
   * Health check endpoints | status etc
   */
  app.get('/status', (req, res) => {
    Logger.log('info', 'checking status', { status: 1 });
    Response.success(res, 'success');
  });

  // pandoras box of security best practices, in a single package
  // including but not limited to removing x-powered-by for powered by attacks etc
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      reportOnly: true, // to allow the local scripts in the test-payment.ejs as well as razorpay frame to load and run 
    }),
  );

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs,
  // but more importantly for the X-forwarded-to header chain
  // and smooth protocol switching from secure proxy to unsecure localhost containers/servers

  app.enable('trust proxy'); // vs 'trust proxy', 1 --> directly specify a single hop

  // HTTP request logger
  app.use(morgan('dev'));

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // "Lets us use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // may not be very useful anymore ?
  app.use(methodOverride());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // might come handy some day if sensitive data is stored in prod for
  // something like PCI DSS compliance etc

  /* app.use(
    AccessLog.global({
      requestWhitelist: ['params', 'body'],
      bodyWhitelist: [],
      bodyBlacklist: [],
      responseWhitelist: ['body'],
      headerBlacklist: [],
    }),
  );
*/
  //handle errors from 'celebrate'
  app.use(errors());

  /**
   * cookie-session handling with redis as the session store
   *
   */
  app.use(
    session({
      store: new RedisStore({ client: redisClient.getClient() }),
      secret: process.env.SESSION_SECRET || 'Random difficult string 12345',
      saveUninitialized: false,
      resave: false,
      name: process.env.SESSION_COOKIE_NAME || 'Session-ID',
      cookie: {
        secure: false, // to allow localhost testing , to be set to true in prod
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_EXPIRY) || 5 * 60 * 1000,
      },
    }),
  );

  app.set('view engine', 'ejs');

  //load API routes
  /**
   * All the APIs reside here among the entire
   * middleware pipeline in this express project
   */
  router.loadRoutes(app, prefix);

  //catch a 404 and forward to error handler
  app.use((req, res, next) => {
    const err = Error(`Route ${req.url} Not Found`);
    err.status = StatusCodes.NOT_FOUND;
    next(err);
  });

  // generic error handlers

  app.use((err, req, res, next) => {
    /**
     * Handle some 401 || generic unauthorized due to middleware jwt/validation || bcrypt auth?
     */
    if (err.name === 'UnauthorizedError') {
      // generic string for now
      return Response.fail(res, err.message, err.status);
    }
    /**
     * Handle errors originating from celebrate/Joi
     */
    if (isCelebrateError(err)) {
      return Response.fail(res, err.message, StatusCodes.UNPROCESSABLE_ENTITY, StatusCodes.UNPROCESSABLE_ENTITY, {
        errors: err.details,
      });
    }

    return Response.fail(res, err.message, err.status);
  });

  app.use((err, req, res) => {
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
