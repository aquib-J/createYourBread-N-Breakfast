const config = {
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
   * Your secret sauce
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
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
  },
};

module.exports = config;
