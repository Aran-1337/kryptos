const jwt = require('jsonwebtoken');
const config = require('../config');

const generateAccessToken = (userId, role, options = {}) => {
  const payload = {
    id: userId,
    role,
    type: options.type || (role === 'assistant' ? 'team_member' : 'user'),
  };
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: options.expiresIn || config.jwt.expiresIn,
  });
};

const crypto = require('crypto');

const generateRefreshToken = (userId, options = {}) => {
  const payload = {
    id: userId,
    type: options.type || 'user',
    jti: crypto.randomBytes(16).toString('hex'),
  };
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: options.expiresIn || config.jwt.refreshExpiresIn,
  });
};

const verifyAccessToken = (token) => jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });

const verifyRefreshToken = (token) => jwt.verify(token, config.jwt.refreshSecret, { algorithms: ['HS256'] });

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
