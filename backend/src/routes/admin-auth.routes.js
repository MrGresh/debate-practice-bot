const express = require("express");
const { adminAuthController } = require("../controllers");

const publicRouter = express.Router();

publicRouter.post("/register", adminAuthController.register);
publicRouter.post("/login", adminAuthController.login);

module.exports = {
  publicRoutes: publicRouter,
};
