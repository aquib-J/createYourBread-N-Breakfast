const { StatusCodes } = require('http-status-codes');

// list of possible custom error messages and codes | can be extended and added as required.

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
  sessionMissing: {
    name: 'CustomError',
    code: StatusCodes.UNAUTHORIZED,
    resCode: 1003,
    message: 'session not found for the user, please log in again',
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
  listingAlreadyBooked: {
    name: 'CustomError',
    code: StatusCodes.CONFLICT,
    resCode: 1012,
    message: 'The listing has already been booked for the given time slot, please try a different time slot',
  },
  failedToFetchListingPrice: {
    name: 'CustomError',
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    resCode: 1013,
    message: 'Failed to fetch out the listing price for total price calculation',
  },
  BookingNotFound: {
    name: 'CustomError',
    code: StatusCodes.NOT_FOUND,
    resCode: 1014,
    message: 'Failed to fetch bookings for the user',
  },
  IncorrectPassword: {
    name: 'CustomError',
    code: StatusCodes.UNAUTHORIZED,
    resCode: 1015,
    message: 'Incorrect password',
  },
  ListingNameExists: {
    name: 'CustomError',
    code: StatusCodes.CONFLICT,
    resCode: 1016,
    message: 'Listing Name already Exists, Please try a different Name',
  },
  FailedToSendEmail: {
    name: 'CustomError',
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    resCode: 1017,
    message: 'Nodemailer failed to send email, please try again',
  },
  FailedToDeleteSession: {
    name: 'CustomError',
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    resCode: 1018,
    message: 'Failed to destroy user session, please try again',
  },
  ResetFailedDueToSession: {
    name: 'CustomError',
    code: StatusCodes.UNAUTHORIZED,
    resCode: 1019,
    message:
      'Failed to Reset due to either having expired token or due to incorrect session info or resetToken in params',
  },
  FailedToCreateSession: {
    name: 'CustomError',
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    resCode: 1020,
    message: 'Failed to regenerate user session, please try again',
  },
  InconsistentCredentials: {
    name: 'CustomError',
    code: StatusCodes.UNAUTHORIZED,
    resCode: 1021,
    message:
      "Incorrect User Login Credential, Please login with the correct user credentials for the user you're trying to view/update resources",
  },
  FailedToFindListing: {
    name: 'CustomError',
    code: StatusCodes.NOT_FOUND,
    resCode: 1022,
    message: 'Failed to find the listing with the Identifier provided',
  },
  AlreadyReviewedForTheLatestBooking: {
    name: 'CustomError',
    code: StatusCodes.CONFLICT,
    resCode: 1023,
    message:
      'Failed to create a new Review for the listing by the User as the User has already reviewed listing post the latest booking',
  },
};
