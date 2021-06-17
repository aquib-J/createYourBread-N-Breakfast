const { Logger, Response, Message } = require('../../utils');
const { AuthenticationService } = require('../../services');
const { v4: uuidv4 } = require('uuid');
const { sessionConfig: { cookieName } } = require('./../../config');

class Authenticate {
  static async checkSession(req, res, next) {
    if (req.session && req.session.session) {
      if (req.session.session.emailId && req.session.session.userId) {
        next();
      } else if (req.session.session.resetToken && req.session.session.expireToken) {
        const hash = await AuthenticationService.fetchUserHash(req.body);

        if (!hash) {
          Response.fail(res, Response.createError(Message.userNotFound));
          return;
        }
        if (
          req.params.resetToken === req.session.session.resetToken &&
          Date.now() - parseInt(req.session.session.expireToken) <= 0
        ) {
          next();
        } else {
          Response.fail(res, Response.createError(Message.ResetFailedDueToSession));
          return;
        }
      } else {
        Response.fail(res, Response.createError(Message.sessionMissing));
        return;
      }
    } else {
      Response.fail(res, Response.createError(Message.sessionMissing));
      return;
    }
  }

  static async attachSession(req, res, next) {
    try {
      //1. check the db to verify if the login cred provided // i.e the password and the email are legit
      //a. find hash using the email, if not return straight away
      //b. compare the password provided, if not , return straight away

      const hash = await AuthenticationService.fetchUserHash(req.body);

      if (!hash) {
        Response.fail(res, Response.createError(Message.userNotFound));
        return;
      }

      const passMatch = await AuthenticationService.compareHashedPassword(req.body.password, hash.password);

      if (!passMatch) {
        Response.fail(res, Response.createError(Message.IncorrectPassword));
        return;
      }

      //2. modify the available req.session object and append session={emailId:,userId:} onto it,
      // which shall be available everywhere downstream for all other routes  to use
      req.session.session = {
        emailId: req.body.emailId,
        userId: hash.id,
      };
      next();
    } catch (err) {
      Logger.log('error', 'error in attach session middleware', err);
      next(Response.createError(Message.tryAgain, err));
    }
  }
  static destroySession(req, res, next) {
    // destroy the session && clear the cookie( doesnt close the connection )
    if (req.session) {
      req.session.destroy((err) => {
        if (err) Response.fail(res, Response.createError(Message.FailedToDeleteSession));

        res.clearCookie(cookieName);

        next();
      });
    } else next();
  }
  static async attachResetSession(req, res, next) {
    try {
      const hash = await AuthenticationService.fetchUserHash(req.body);

      if (!hash) {
        Response.fail(res, Response.createError(Message.userNotFound));
        return;
      }
// destroys and creates a new session if previously existed or just creates a new one
      req.session.regenerate((err) => {
        if (err) {
          Response.fail(res, Response.createError(Message.FailedToCreateSession));
          return;
        }
        req.session.session = {
          resetToken: uuidv4(),
          expireToken: Date.now() + 1 * 60 * 60 * 1000, // 1 hr of expiry time
        };
        next();
      });
    } catch (err) {
      Logger.log('error', 'error in attach Reset Session middleware', err);
      next(Response.createError(Message.tryAgain, err));
    }
  }
}

// TODO: the error handling need further revisiting
module.exports = Authenticate;
