const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  OTP_EXPIRY_MINUTES: process.env.OTP_EXPIRY_MINUTES,
};

module.exports = {
  AUTH_CONFIG,
};