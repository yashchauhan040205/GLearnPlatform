const crypto = require('crypto');

const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
};

const getTokenExpiry = (hours = 24) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

module.exports = { generateVerificationToken, getTokenExpiry };
