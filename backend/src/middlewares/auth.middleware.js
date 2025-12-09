const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { AUTH_CONFIG } = require("../constants");
const { getLogger } = require("../utils");
const logger = getLogger(module);

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      req.user = user;

      next();
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);
      // Token is expired, invalid, or malformed
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed or expired",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};
