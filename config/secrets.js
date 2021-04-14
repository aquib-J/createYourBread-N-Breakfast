module.exports.load = async function (envPath) {
  try {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'local') {
      process.env.NODE_ENV = 'local';
      require('dotenv').config({
        path: envPath,
      });
    } else {
      // have to configure loadup from heroku
    }
  }
  catch(err){
      console.log('Error', err);
  }
};
