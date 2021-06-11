const redis = require('redis');
const _ = require('lodash');
const Config = require('../config');

let redisClient = null;

const retry_strategy = function (options) {
  if (options.error && (options.error.code === 'ECONNREFUSED' || options.error.code === 'NR_CLOSED')) {
    // Try reconnecting after 5 seconds
    console.error('The server refused the connection. Retrying connection...');
    return 5000;
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    // End reconnecting after a specific timeout and flush all commands with an individual error
    return new Error('Retry time exhausted');
  }
  if (options.attempt > 50) {
    // End reconnecting with built in error
    return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
};
class Redis {
  static async init() {
    redisClient = await redis.createClient({
      ...Config.redis.config,
      retry_strategy,
    });
  }

  static getClient() {
    return redisClient;
  }

  static async set(key, val, expire = null) {
    return new Promise((resolve, reject) => {
      if (_.isPlainObject(val) || _.isArrayLikeObject(val)) {
        val = JSON.stringify(val);
      }
      if (expire) {
        redisClient.set(key, val, 'EX', expire, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        redisClient.set(key, val, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }

  static async get(key) {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (err, val) => {
        if (err) {
          reject(err);
        } else {
          try {
            val = JSON.parse(val);
          } catch (e) {
            //
          }
          resolve(val);
        }
      });
    });
  }
}

module.exports = Redis;
