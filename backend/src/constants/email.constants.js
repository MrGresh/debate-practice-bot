const EMAIL_CONFIG = {
  EMAIL_CREDENTIALS: {
    host: process.env.MAIL_HOST || 'smtp.sendgrid.net',
    port: process.env.MAIL_PORT || 465,
    secure: process.env.MAIL_SECURE === "true" || true,
    auth: {
      user: process.env.MAIL_USER || 'apikey',
      pass: process.env.MAIL_PASSWORD || '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',
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS || 'greshseh@gmail.com',
};

module.exports = {
  EMAIL_CONFIG,
};
