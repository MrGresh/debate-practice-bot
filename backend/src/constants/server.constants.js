const SERVER_CONFIG = {
  APP_NAME: process.env.APP_NAME,
  PORT: process.env.PORT,
  INTERVIEW_FRONTEND_URL: process.env.INTERVIEW_FRONTEND_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB,
  IS_SCHEDULER_ENABLED: process.env.IS_SCHEDULER_ENABLED === 'true',
};

module.exports = {
  SERVER_CONFIG,
};