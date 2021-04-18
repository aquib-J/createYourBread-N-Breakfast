const {Logger,Response}=require('../utils');

const user=require('./modules/user/userRoutes');

exports.loadRoutes=(app,prefix)=>{
    app.use(`${prefix}/v1/user`,user);
  /*  app.use(`${prefix}/v1/dummy2`,dummyRoutes);
    app.use(`${prefix}/v1/dummy2`,dummyRoutes);
    app.use(`${prefix}/v1/dummy2`,dummyRoutes);
    */
   app.all('/status',(req,res)=>{
     const data={
       service:process.env.SERVICE_NAME,
       headers:req.headers,
       params:req.params,
       query:req.query,
       body:req.body,
     };
     Logger.log('info','checking bnb backend status',data);
     Response.success(res,'success',data);
   })
}