const redis = require('redis');
const _ = require('lodash');
const Config = require('../config');
const { Logger } = require('../utils');

let redisClient = null;

class Redis {
  static init() {
    redisClient = redis.createClient(Config.redis.config);
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

module.exports=Redis;
