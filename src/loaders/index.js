const {Logger,Migration:migrate} =require('../utils');
const {sequelizeConfig}=require('../config');
const {sequelize}=require('./sequelize');
const expressLoader=require('./express');


const loader=async function({expressApp}){
    if(sequelizeConfig.autoMigrate==='true' || sequelizeConfig.autoMigrate===true){
        await migrate();
        Logger.log('info','✌️ DB Migrated');
    }

    await sequelize.authenticate();
    Logger.log('info','✌️ DB loaded and connected!');

    await expressLoader.loadModules({app:expressApp});
    Logger.log('info', '✌️ Express loaded');

    // TODO: setup Redis for session

}

module.exports=loader;