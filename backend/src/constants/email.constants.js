const EMAIL_CONFIG = {
  EMAIL_CREDENTIALS: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
};

module.exports = {
  EMAIL_CONFIG,
};
