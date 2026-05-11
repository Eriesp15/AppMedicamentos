const {getUserFromToken} = require('../services/auth.service');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({message: 'UNAUTHORIZED'});
  }

  const user = getUserFromToken(token);
  if (!user) {
    return res.status(401).json({message: 'INVALID_TOKEN'});
  }

  req.user = user;
  return next();
}

module.exports = {requireAuth};
