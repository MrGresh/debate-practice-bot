const express = require("express");
const { userAuthController } = require("../controllers");

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post("/register", userAuthController.register);
publicRouter.post("/verify-otp", userAuthController.verifyOtp);
publicRouter.post("/resend-otp", userAuthController.resendOtp);
publicRouter.post("/login", userAuthController.login);
publicRouter.post("/forgot-password/send-otp", userAuthController.forgotPasswordSendOtp);
publicRouter.post("/forgot-password/reset", userAuthController.verifyForgotPasswordOtp);

protectedRouter.post("/logout", userAuthController.logout);
protectedRouter.get("/validate-token", userAuthController.validateToken);

protectedRouter.post("/change-password", userAuthController.changePassword);
protectedRouter.post("/change-email/send-otp", userAuthController.sendChangeEmailOtp);
protectedRouter.post("/change-email/verify-otp", userAuthController.verifyChangeEmailOtp);

protectedRouter.get("/profile", userAuthController.getProfile);

module.exports = {
  protectedRoutes: protectedRouter,
  publicRoutes: publicRouter,
};
