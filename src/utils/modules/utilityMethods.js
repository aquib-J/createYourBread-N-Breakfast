const { randomBytes } = require('crypto');

module.exports = {
  getRandomNumber: () => Math.floor(100000000000 + Math.random() * 900000000000).toString(),
  get12DigitRandomNumber: () => randomBytes(6).toString('hex'),
  toFloat: (item) => parseFloat(item).toFixed(2) * 1,
  getCryptoRandom: () => randomBytes(7).toString('hex'),
};
