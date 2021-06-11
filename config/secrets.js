module.exports.load = async function (envPath) {
  try {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'local') {
      process.env.NODE_ENV = 'local';
      require('dotenv').config({
        path: envPath,
      });
    } else {
      // don't need in prod as the env variables are injected into the local shell
    }
  }
  catch(err){
      console.log('Error', err);
  }
};
