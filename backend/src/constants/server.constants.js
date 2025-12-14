const SERVER_CONFIG = {
  APP_NAME: process.env.APP_NAME || 'DebatePracticeBot',
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/debate-practice-bot',
  MONGODB_DB: process.env.MONGODB_DB || 'debate-practice-bot',
  IS_SCHEDULER_ENABLED: process.env.IS_SCHEDULER_ENABLED === 'true' || false,
};

module.exports = {
  SERVER_CONFIG,
};