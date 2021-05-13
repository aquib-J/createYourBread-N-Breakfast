const { Logger, Response, Message } = require('../../utils');
const { AuthenticationService } = require('../../services');

class Authenticate {
  static checkSession(req, res, next) {
    if (req.session && req.session.session && req.session.session.emailId && req.session.session.userId) {
        //TODO: add checks for mismatch between the info in session and the one passed down in the req call once all the APIs are complete,
      next();
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
    req.session.destroy((err) => {
      if (err) Response.fail(res, Response.createError(Message.FailedToDeleteSession));

      res.clearCookie(process.env.SESSION_COOKIE_NAME);

      next();
    });
  }
}

// TODO: the error handling need further revisiting
module.exports = Authenticate;
