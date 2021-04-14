const path = require('path');

const { secrets, configurations } = require('./config');

(async () => {
  try {
    //loading env file
    const envPath = `${__dirname}/.env`;
    await secrets.load(envPath);

    console.log('loaded env');

    await require(path.join(__dirname, 'src', 'app.js'));

    console.log('Loaded main application');
 
} catch (err) {
    console.log('Error in entry point index.js', err);
  }
})();
