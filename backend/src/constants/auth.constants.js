const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'G9A7_H4FkL3!sQwZr2pYxT8mJcEvBnDuC6tI0oPpLqRsUvWxYzAbCdEfGhIjKlMn',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OTP_EXPIRY_MINUTES: process.env.OTP_EXPIRY_MINUTES || 10,
};

module.exports = {
  AUTH_CONFIG,
};