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
  