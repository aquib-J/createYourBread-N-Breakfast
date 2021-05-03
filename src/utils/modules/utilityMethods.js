const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { Logger } = require('.');


const readFile = util.promisify(fs.readFile);

let cityArray = [];
let countryArray = [];
let stateArray = [];

module.exports = {
  cityArray,
  stateArray,
  countryArray,
  getRandomNumber: () => Math.floor(100000000000 + Math.random() * 900000000000).toString(),
  get12DigitRandomNumber: () => randomBytes(6).toString('hex'),
  toFloat: (item) => parseFloat(item).toFixed(2) * 1,
  getCryptoRandom: () => randomBytes(7).toString('hex'),
  FILL_CITY_STATE_COUNTRY: async () => {
    try {
      const data = await readFile('city-state-country-data-dump.json', 'utf8');

      let STATE_POS = 0;
      JSON.parse(data).Countries.forEach((country, i) => {
        countryArray.push({
          countryName: `${country.CountryName}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        country.States.forEach((state, j) => {
          stateArray.push({
            stateName: `${state.StateName}`,
            countryId: i + 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          state.Cities.forEach((city, k) => {
            cityArray.push({
              cityName: `${city}`,
              stateId: STATE_POS + 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          });
          STATE_POS++;
        });
      });
      return { cityArray, stateArray, countryArray };
    } catch (err) {
      Logger.log('error', 'failed to load city-state-country-data-file', err);
      throw err;
    }
  },

};


