const { StatusCodes } = require('http-status-codes');

// list of possible customer error messages and codes | can be extended and added as required.

// custom error code helps track down the exact cause of the error

module.exports = {
  tryAgain: {
    name: 'CustomError',
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'please try again',
  },
  userNotFound: {
    name: 'CustomError',
    code: StatusCodes.NOT_FOUND,
    resCode: 1000,
    message: 'user not found',
  },
  userExists: {
    name: 'CustomError',
    code: StatusCodes.CONFLICT,
    resCode: 1001,
    message: 'user already exists',
  },
  errorUpdatingUser: {
    name: 'CustomError',
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    resCode: 1002,
    message: 'error updating User, please try again',
  },
  tokenMissing: {
    name: 'CustomError',
    code: StatusCodes.UNAUTHORIZED,
    resCode: 1003,
    message: 'cognito id token missing',
  },
  userIdMissing: {
    name: 'CustomError',
    code: StatusCodes.UNAUTHORIZED,
    resCode: 1004,
    message: 'user id missing',
  },
  fileEmpty: {
    name: 'CustomError',
    code: StatusCodes.UNPROCESSABLE_ENTITY,
    resCode: 1005,
    message: 'file is empty',
  },
  queryNotFound: {
    name: 'CustomError',
    code: StatusCodes.NOT_FOUND,
    resCode: 1006,
    message: 'Query not found',
  },
  mobileExist: {
    name: 'CustomError',
    code: StatusCodes.CONFLICT,
    resCode: 1007,
    message: 'mobile already exist',
  },
  emailExist: {
    name: 'CustomError',
    code: StatusCodes.CONFLICT,
    resCode: 1008,
    message: 'card kit already exist',
  },
  cardNotFound: {
    name: 'CustomError',
    code: StatusCodes.NOT_FOUND,
    resCode: 1009,
    message: 'card not found',
  },
  softDeleteFailed: {
    name: 'CustomError',
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    resCode: 1010,
    message: 'soft Delete Failed',
  },
  invalidDate: {
    name: 'CustomError',
    code: StatusCodes.BAD_REQUEST,
    resCode: 1011,
    message: 'Invalid date',
  },
};
