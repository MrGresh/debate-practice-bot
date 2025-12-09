const { adminAuthService } = require("../services");
const { getLogger } = require("../utils");
const logger = getLogger(module);

exports.register = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: "Admin ID and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const result = await adminAuthService.register(adminId, password);

    res.status(201).json({
      success: true,
      message: result.message,
      data: { adminId: result.adminId },
    });
  } catch (error) {
    logger.error(`Admin registration error: ${error.message}`);

    let statusCode = 500;
    if (error.message.includes("already registered")) {
      statusCode = 409;
    }

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: "Admin ID and password are required.",
      });
    }

    const result = await adminAuthService.login(adminId, password);

    res.status(200).json({
      success: true,
      message: result.message,
      data: { adminId: result.adminId, _id: result._id },
    });
  } catch (error) {
    logger.error(`Admin login error for ${req.body.adminId}: ${error.message}`);

    let statusCode = 500;
    if (error.message.includes("Invalid credentials")) {
      statusCode = 401;
    }

    res
      .status(statusCode)
      .json({ success: false, message: "Invalid credentials." });
  }
};
