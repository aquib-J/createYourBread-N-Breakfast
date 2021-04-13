const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../config');

const baseName = path.basename(__filename);
const models = {};

const modelsPath = `${__dirname}/../models`;

Sequelize.Promise.config({
  longStackTraces: true,
});

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
  host: config.database.host,
  dialect: config.database.dialect,
});

fs.readdirSync(modelsPath)
  .filter((file) => file.indexOf('.') !== 0 && file !== baseName && file.slice(-3) === '.js')
  .forEach(file=>{
      const model=sequelize.import(path.join(modelsPath,file));
      models[model.name]=model;
  });

  Object.keys(models).forEach(modeName=>{
      if(models[modelName].associate){
          models[modelName].associate(models);
      }
  });

  module.exports={
      sequelize,
      models,
  }
