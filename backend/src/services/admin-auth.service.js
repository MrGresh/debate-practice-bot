const bcrypt = require("bcrypt");
const { Admin } = require("../models");
const { getLogger } = require("../utils");
const logger = getLogger(module);

exports.register = async (adminId, password) => {
  const existingAdmin = await Admin.findOne({ adminId });

  if (existingAdmin) {
    logger.warn(`Admin registration failed: ID ${adminId} already exists.`);
    throw new Error("Admin ID is already registered.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAdmin = new Admin({
    adminId,
    password: hashedPassword,
  });

  await newAdmin.save();

  logger.info(`New admin registered successfully: ${adminId}`);

  return {
    message: "Admin account created successfully.",
    adminId: newAdmin.adminId,
    _id: newAdmin._id,
  };
};

exports.login = async (adminId, password) => {
  const admin = await Admin.findOne({ adminId }).select("+password");

  if (!admin) {
    throw new Error("Invalid credentials.");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  logger.info(`Admin logged in successfully: ${adminId}`);

  return {
    message: "Admin login successful.",
    adminId: admin.adminId,
    _id: admin._id,
  };
};
