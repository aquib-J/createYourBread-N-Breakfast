const {Logger,Response}=require('../utils');

const login=require('./modules/login');

exports.loadRoutes=(app,prefix)=>{
    app.use(`${prefix}/v1/login`,login);
  /*  app.use(`${prefix}/v1/dummy2`,dummyRoutes);
    app.use(`${prefix}/v1/dummy2`,dummyRoutes);
    app.use(`${prefix}/v1/dummy2`,dummyRoutes);
    */
}