const _ = require('lodash');
const winston = require('winston');
const { Logger } = require('.');
require('winston-daily-rotate-file');

const Config = require('../../config');

let LoggerInstance = null;

module.exports = {
  init: ({ transports = [], level = 'info', defaultMeta = {} } = {}) => {
    const loggerLevels = {
      fatal: 0,
      alert: 1,
      error: 2,
      warning: 3,
      info: 4,
      debug: 5,
      trace: 6,
    };
    const loggerColors = {
      fatal: 'blue',
      alert: 'magenta',
      error: 'red',
      warning: 'yellow',
      info: 'green',
      debug: 'cyan',
      trace: 'white',
    };

    if (!_.isArray(transports)) {
      throw new Error('transports is not an array');
    }
    if (!Object.keys(loggerLevels).includes(level)) {
      throw new Error('invalid level');
    }
    if (!_.isObject(defaultMeta) || _.isArray(defaultMeta)) {
      throw new Error('invalid default meta');
    }
    if (_.isEmpty(transports)) {
      if (process.env.NODE_ENV === 'local') {
        transports.push(
          new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.simple()),
          }),
        );
      } else {
        const fileTransport = new winston.transports.DailyRotateFile({
          filename: `/var/log/${Config.service.name}/app.log.%DATE%`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          handleExceptions: true,
          json: true,
          maxSize: '100m',
          maxFiles: '15d',
          format: winston.format.json,
        });
        transports.push(
          new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.simple()),
          }),
          fileTransport,
        );
      }
    }
    if (!_.isEmpty(defaultMeta) || !defaultMeta.service) {
      defaultMeta.application = Config.service.name;
    }

    winston.addColors(loggerColors);

    LoggerInstance = winston.createLogger({
      level: level || 'info',
      levels: loggerLevels,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
          alias: '@timestamp',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        winston.format.printf(
          (info) =>
            `@${info.timestamp} - ${info.level}: ${info.message} ${stringifyExtraMessagePropertiesForConsole(info)}`,
        ),
      ),
      transports,
      defaultMeta,
    });
  },

  log: (level, message, meta = {}) => {
    if (!_.isObject(meta)) {
      meta = { meta };
    } else if ('message' in meta && meta.message) {
      message += ' ';
    }

    LoggerInstance.log(level, message, meta);
  },

  stream: {
    write: (message) => LoggerInstance.log('debug', message),
  },
};

function stringifyExtraMessagePropertiesForConsole(info) {
  const skippedProps = ['message', 'timestamp', 'level'];
  let response = '';
  for (const key in info) {
    const value = info[key];
    if (!skippedProps.includes(key) && value !== undefined && value !== null) {
      response += `${key}=${value}`;
    }
  }
  return response;
}
