const fs = require("fs");
const path = require("path");
const { SERVER_CONFIG } = require("../constants");
const { getLogger, sendEmail } = require("../utils");
const logger = getLogger(module);

const appName = SERVER_CONFIG.APP_NAME;
const currentYear = new Date().getFullYear();

exports.sendOTPEmail = async (email, otp) => {
  logger.info(`Sending OTP email to ${email} with OTP: ${otp}`);

  const templatePath = path.join(__dirname, "..", "emails", "otp.email.html");
  const emailTemplate = fs.readFileSync(templatePath, "utf8");

  const html = emailTemplate
    .replace(/{{APP_NAME}}/g, appName)
    .replace(/{{OTP_CODE}}/g, otp)
    .replace(/{{CURRENT_YEAR}}/g, currentYear);

  const subject = `Your ${appName} Verification Code: ${otp}`;

  const text = `
    Hello,
    
    Thank you for registering with ${appName}.
    
    Your One-Time Password (OTP) for verification is: ${otp}
    
    This code is valid for 10 minutes. Please enter it in the app to complete your registration.
    
    The ${appName} Team
  `.trim();

  return sendEmail(email, subject, text, html);
};

exports.sendForgotPasswordOTPEmail = async (email, otp) => {
  logger.info(`Sending Forgot Password OTP email to ${email} with OTP: ${otp}`);

  const templatePath = path.join(
    __dirname,
    "..",
    "emails",
    "forgot-password.email.html"
  );
  const emailTemplate = fs.readFileSync(templatePath, "utf8");

  const html = emailTemplate
    .replace(/{{APP_NAME}}/g, appName)
    .replace(/{{OTP_CODE}}/g, otp)
    .replace(/{{CURRENT_YEAR}}/g, currentYear);

  const subject = `Your ${appName} Password Reset Code: ${otp}`;

  const text = `
    Hello,
    
    You recently requested a password reset for your ${appName} account.
    
    Your One-Time Password (OTP) for password reset is: ${otp}
    
    This code is valid for 10 minutes. Please enter it in the app to reset your password.
    
    The ${appName} Team
  `.trim();

  return sendEmail(email, subject, text, html);
};

exports.sendChangeEmailOTPEmail = async (email, otp) => {
  logger.info(`Sending Change Email OTP email to ${email} with OTP: ${otp}`);

  const templatePath = path.join(
    __dirname,
    "..",
    "emails",
    "change-mail.email.html"
  );
  const emailTemplate = fs.readFileSync(templatePath, "utf8");

  const html = emailTemplate
    .replace(/{{APP_NAME}}/g, appName)
    .replace(/{{OTP_CODE}}/g, otp)
    .replace(/{{NEW_EMAIL}}/g, email)
    .replace(/{{CURRENT_YEAR}}/g, currentYear);

  const subject = `Verify Your New Email for ${appName}: ${otp}`;

  const text = `
    Hello,
    
    You requested to change your email for ${appName}.
    
    Your One-Time Password (OTP) to verify the new email is: ${otp}
    
    This code is valid for 10 minutes.
    
    The ${appName} Team
  `.trim();

  return sendEmail(email, subject, text, html);
};
