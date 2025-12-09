const { userAuthService } = require("../services");
const { getLogger } = require("../utils");
const logger = getLogger(module);

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 6 characters long." });
    }

    const result = await userAuthService.register(name, email, password);

    res.status(202).json({
      success: true,
      message: result.message,
      data: { userId: result.userId },
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    let statusCode = 500;
    if (error.message.includes("already registered")) {
      statusCode = 409;
    } else if (error.message.includes("Could not send")) {
      statusCode = 503;
    }
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    const result = await userAuthService.verifyOtp(email, otp);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error(`OTP Verification error: ${error.message}`);
    let statusCode = 500;
    if (error.message.includes("not found")) {
      statusCode = 404;
    } else if (
      error.message.includes("Invalid OTP") ||
      error.message.includes("expired")
    ) {
      statusCode = 400;
    }
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const result = await userAuthService.resendOtp(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error(`Resend OTP error: ${error.message}`);
    let statusCode = 500;
    if (
      error.message.includes("not found") ||
      error.message.includes("already verified")
    ) {
      statusCode = 400;
    } else if (error.message.includes("Could not send")) {
      statusCode = 503;
    }

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const result = await userAuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    let statusCode = 500;

    if (error.message.includes("Invalid credentials")) {
      statusCode = 401;
    } else if (error.message.includes("not verified")) {
      statusCode = 403;
    }

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Server error during logout." });
  }
};

exports.validateToken = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized or token expired." });
    }

    res.status(200).json({
      success: true,
      message: "Token validation successful. Login successful.",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    logger.error(`Validate Token error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error during token validation.",
    });
  }
};

exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const result = await userAuthService.forgotPasswordSendOtp(email);

    res.status(202).json({
      success: true,
      message: result.message,
      data: { email: result.email },
    });
  } catch (error) {
    logger.error(`Forgot Password Send OTP error: ${error.message}`);
    let statusCode = 500;

    if (error.message.includes("User not found")) {
      statusCode = 400;
    } else if (error.message.includes("Could not send")) {
      statusCode = 503;
    }

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Email, OTP, and newPassword are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 6 characters long." });
    }

    const result = await userAuthService.verifyForgotPasswordOtp(
      email,
      otp,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        userId: result.userId,
      },
    });
  } catch (error) {
    logger.error(`Forgot Password Verify OTP/Reset error: ${error.message}`);
    let statusCode = 500;

    if (
      error.message.includes("Invalid email or OTP") ||
      error.message.includes("OTP expired") ||
      error.message.includes("not initiated")
    ) {
      statusCode = 400;
    }

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 6 characters long." });
    }

    const result = await userAuthService.changePassword(userId, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error(`Change Password error: ${error.message}`);
    let statusCode = 500;

    if (error.message.includes("User not found")) {
      statusCode = 404;
    }

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.sendChangeEmailOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ success: false, message: "New email is required." });
    }

    const result = await userAuthService.sendChangeEmailOtp(userId, newEmail);

    res.status(202).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error(`Send Change Email OTP error: ${error.message}`);
    let statusCode = 500;

    if (error.message.includes("already registered")) {
      statusCode = 409;
    } else if (error.message.includes("not found")) {
      statusCode = 404;
    } else if (error.message.includes("Could not send")) {
      statusCode = 503;
    }

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.verifyChangeEmailOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required." });
    }

    const result = await userAuthService.verifyChangeEmailOtp(userId, otp);

    res.status(200).json({
      success: true,
      message: result.message,
      data: { newEmail: result.newEmail },
    });
  } catch (error) {
    logger.error(`Verify Change Email OTP error: ${error.message}`);
    let statusCode = 500;

    if (
      error.message.includes("Invalid verification details") ||
      error.message.includes("OTP expired") ||
      error.message.includes("Invalid OTP")
    ) {
      statusCode = 400;
    }

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized or token expired." });
    }

    const { _id, name, email } = req.user;

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      data: {
        _id,
        name,
        email,
      },
    });
  } catch (error) {
    logger.error(`Get Profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error during profile retrieval.",
    });
  }
};
