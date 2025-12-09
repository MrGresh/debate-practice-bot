const nodemailer = require("nodemailer");
const { EMAIL_CONFIG } = require("../constants");
const { getLogger } = require("./logger");
const logger = getLogger(module);

exports.sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport(
      EMAIL_CONFIG.EMAIL_CREDENTIALS
    );
    await transporter.sendMail({
      from: EMAIL_CONFIG.MAIL_FROM_ADDRESS,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    return true;
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    throw new Error(`Failed to send email to ${to}: ${error.message}`);
  }
};
