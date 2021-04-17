const { Logger, Migration: migrate } = require('../utils');
const Config = require('../config');
const { sequelize } = require('./sequelize');
const expressLoader = require('./express');
const Redis = require('./redis');

const loader = async function ({ expressApp }) {
  if (Config.sequelizeConfig.autoMigrate === 'true' || sequelizeConfig.autoMigrate === true) {
    await migrate();
    Logger.log('info', '** DB Migrated **');
  }

  await sequelize.authenticate();
  Logger.log('info', '** DB loaded and connected! **');

  await expressLoader.loadModules({ app: expressApp });
  Logger.log('info', '** Express loaded **');

  if (Config.redis.enabled) {
    await Redis.init();
    Logger.log('info', '** Redis connected **');
  } else {
    Logger.log('info', '** Redis disabled **');
  }
};

module.exports = loader;