const winston = require('winston');
const expressWinston = require('express-winston');

const Config = require('../../config');

class AccessLog {
  static global({
    requestWhitelist = [],
    bodyWhitelist = [],
    bodyBlacklist = [],
    responseWhitelist = [],
    headerBlacklist = [],
  }) {
    let _requestWhitelist = ['httpVersion', 'url', 'originalUrl', 'method', 'headers', 'query', 'params'];
    let _bodyWhitelist = [];
    let _bodyBlacklist = [];
    let _responseWhitelist = ['statusCode'];
    let _headerBlacklist = ['idtoken', 'temptoken', 'internal_request_token'];

    _requestWhitelist = _requestWhitelist.concat(requestWhitelist);
    _bodyWhitelist = _bodyWhitelist.concat(bodyWhitelist);
    _bodyBlacklist = _bodyBlacklist.concat(bodyBlacklist);
    _responseWhitelist = _responseWhitelist.concat(responseWhitelist);
    _headerBlacklist = _headerBlacklist.concat(headerBlacklist);

    const transports = [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.cli(), winston.format.simple()),
      }),
    ];

    /* if (!Config.isLocal) {
      const fileTransport = new winston.transports.DailyRotateFile({
        filename: `/var/log/${Config.service.name}/access.log.%DATE%`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        json: true,
        maxSize: '100m',
        maxFiles: '15d',
        format: winston.format.json(),
      });
      transports.push(fileTransport);
    }
*/
    return expressWinston.logger({
      transports,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
          alias: '@timestamp',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      level: 'info',
      msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}} ms', // customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}", "HTTP {{req.method}} {{req.url}}" or function(req, res) { return `${res.statusCode} - ${req.method}`.  Warning: while supported, returning mustache style interpolation from an options.msg function has performance and memory implications under load.
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: Config.isLocal, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      meta: !Config.isLocal, // optional: control whether you want to log the meta data about the request (default to true)
      baseMeta: {},
      metaField: null,
      ignoreRoute(req, res) {
        // console.log(req.originalUrl);
        return false;
      }, // A function to determine if logging is skipped, defaults to returning false. Called _before_ any later middleware.
      skip(req, res) {
        if (req._routeWhitelists.ignoreRoute) {
          return true;
        }
        return false;
      }, // A function to determine if logging is skipped, defaults to returning false. Called _after_ response has already been sent.
      requestFilter(req, propName) {
        return req[propName];
      }, // A function to filter/return request values, defaults to returning all values allowed by whitelist. If the function returns undefined, the key/value will not be included in the meta.
      responseFilter(req, propName) {
        return req[propName];
      }, // A function to filter/return response values, defaults to returning all values allowed by whitelist. If the function returns undefined, the key/value will not be included in the meta.
      requestWhitelist: _requestWhitelist, // Array of request properties to log. Overrides global requestWhitelist for this instance
      responseWhitelist: _responseWhitelist, // Array of response properties to log. Overrides global responseWhitelist for this instance
      bodyWhitelist: _bodyWhitelist, // Array of body properties to log. Overrides global bodyWhitelist for this instance
      bodyBlacklist: _bodyBlacklist, // Array of body properties to omit from logs. Overrides global bodyBlacklist for this instance
      ignoredRoutes: [], // Array of paths to ignore/skip logging. Overrides global ignoredRoutes for this instance
      dynamicMeta(req, res) {
        return {
          application: Config.service.name,
          remoteIp: req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip, // just ipv4
          referrer: req.get('Referrer'),
        };
      }, // Extract additional meta data from request or response (typically req.user data if using passport). meta must be true for this function to be activated
      headerBlacklist: _headerBlacklist, // Array of headers to omit from logs. Applied after any previous filters.
    });
  }

  static route({
    requestWhitelist = [],
    bodyWhitelist = [],
    bodyBlacklist = [],
    responseWhitelist = [],
    ignore = false,
  } = {}) {
    return (req, res, next) => {
      req._routeWhitelists.req = requestWhitelist;
      req._routeWhitelists.body = bodyWhitelist;
      req._routeBlacklists.body = bodyBlacklist;
      req._routeWhitelists.res = responseWhitelist;
      req._routeWhitelists.ignoreRoute = ignore;

      next();
    };
  }
}

module.exports = AccessLog;
