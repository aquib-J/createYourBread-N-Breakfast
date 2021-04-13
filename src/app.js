const { Logger } = require('./utils');
const config = require('./config');
const initLoader = require('./loaders');
const express = require('express');

Logger.init({ level: config.logs.level });

(async () => {
  try {
    const app = express();

    await initLoader({ expressApp: app });
    app.listen(config.port, (err) => {
      if (err) {
        Logger.log('error', '', err);
        process.exit(1);
        return;
      }
      Logger.log('info', `bread and breakfast on port :${config.port}`,);
    });
  }catch(err){
      console.log('error-------------------------------------------------', err);
      Logger.log('error','',err);
  }
})();
