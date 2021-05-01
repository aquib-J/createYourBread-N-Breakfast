const { exec } = require('child_process');

module.exports = () =>
  new Promise((resolve, reject) => {
    if (process.env.AUTO_MIGRATE && process.env.AUTO_MIGRATE.toLowerCase() === 'false') {
      resolve();
    } else {
      if (process.env.NODE_ENV) {
        exec('sequelize-cli db:migrate', { maxBuffer: 1024 * 20000 }, (err, stdout, stderr) => {
          // by-default buffer size is 1024KB, we can set a higher range as we've done above
          if (err) {
            reject(err);
          } else if (stderr) {
            reject(stderr);
          } else {
            resolve();
          }
        });
      } else {
        reject(new Error('⚠️  Environment not set  ⚠️'));
      }
    }
  });
