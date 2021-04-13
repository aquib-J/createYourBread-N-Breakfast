const cmd = require('node-cmd');

module.exports = () =>
  new Promise((resolve, reject) => {
    if (process.env.AUTO_MIGRATE && process.env.AUTO_MIGRATE.toLowerCase() === 'false') {
      resolve();
    } else {
      if (process.env.NODE_ENV) {
        cmd.get('sequelize-cli db:migrate', (err, data, stderr) => {
          if (err) {
            reject(err);
          } else if (stderr) {
            reject(stderr);
          } else {
            resolve(data);
          }
        });
      } else {
        reject(new Error('⚠️  Environment not set  ⚠️'));
      }
    }
  });
