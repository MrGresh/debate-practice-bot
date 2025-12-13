const express = require("express");
const router = express.Router();

const { apiLimiter, protect } = require("../middlewares");

const authRoutes = require("./user-auth.routes");
const adminRoutes = require("./admin-auth.routes");
const vapiAssistantsRoutes = require("./vapi.routes");

router.use(apiLimiter);

// ------------ Public Routes ------------
router.use("/user-auth", authRoutes.publicRoutes);
router.use("/admin", adminRoutes.publicRoutes);
router.use("/vapi", vapiAssistantsRoutes.publicRoutes);

router.use(protect);

// ------------ Protected Routes ------------
router.use("/user-auth", authRoutes.protectedRoutes);
router.use("/vapi", vapiAssistantsRoutes.protectedRoutes);

module.exports = router;
