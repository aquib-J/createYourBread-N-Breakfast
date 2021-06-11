const config = {
  service: {
    name: process.env.SERVICE_NAME,
  },

  isLocal: !(process.env.NODE_ENV === 'production') ? true : false,

  /**
   * seed with mock data for tables other than city,state and country
   */
  dataMock:
    process.env.NODE_ENV === 'local' &&
    (process.env.SEED_WITH_MOCK === true || process.env.SEED_WITH_MOCK.toLowerCase() === 'true')
      ? true
      : false,
  /**
   *  no of mock entries to create
   */
  noOfMockRecords: process.env.NO_OF_MOCK_RECORDS,
  /**
   * port of choice
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from mlab
   */
  database: {
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    name: process.env.PG_DBNAME,
    host: process.env.PG_URL,
    dialect: 'postgres',
  },

  /**
   * your friendly fast KV store
   */

  redis: {
    enabled: !(process.env.REDIS_ENABLED && process.env.REDIS_ENABLED === 'false'),
    config: {
      url: process.env.REDIS_URL,
      path: process.env.REDIS_PATH,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
  /**
   *
   * Session stuff
   *
   */

  sessionConfig: {
    secret: process.env.SESSION_SECRET,
    cookieName: process.env.SESSION_COOKIE_NAME,
    expiry: process.env.SESSION_EXPIRY,
  },

  /**
   * Your secret sauce || not a good idea except for service to service communication
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  /**
   * Kafka configuration
   */
  /**
   * Zeebe Configuration
   */

  sequelizeConfig: {
    autoMigrate: process.env.AUTO_MIGRATE || 'true',
  },
  awsConfig: {
    s3Config: {
      maxFileSize: process.env.S3_MAX_FILE_SIZE,
      bnbTestBucket: process.env.S3_BUCKET,
      dpBucket: process.env.S3_DP_BUCKET,
      listingImagesBucket: process.env.S3_LISTING_IMAGES_BUCKET,
    },
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
  },
  razorpayConfig: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
  emailConfig: {
    serviceEmail: process.env.EMAIL,
    serviceEmailPassword: process.env.EMAIL_PASS,
  },
  // resetUrl to be configured by the domain of the frontend to form a nice
  // url link like //mywebsite.com/auth/reset/{resetId}
  resetUrl: {
    link: process.env.RESET_URL,
  },
};

module.exports = config;
