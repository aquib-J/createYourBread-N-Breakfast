/**
 *  stacks everything from params,query etc to body
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
  if (req.method === 'GET') {
    Object.assign(req.body, req.query, req.params, req.session);
  } else {
    Object.assign(req.body, req.params, req.session);
  }
  next();
};
