const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Email = require("./email.service");
const { User } = require("../models");
const { AUTH_CONFIG } = require("../constants");

const OTP_EXPIRY_MINUTES = AUTH_CONFIG.OTP_EXPIRY_MINUTES;

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (name, email, password) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new Error("User already registered and verified.");
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

    existingUser.name = name;
    const salt = await bcrypt.genSalt(10);
    existingUser.password = await bcrypt.hash(password, salt);
    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    await existingUser.save();

    await Email.sendOTPEmail(email, otp);

    return {
      message: "User already exists but is unverified. New OTP sent to email.",
      userId: existingUser._id,
    };
  }

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpiry,
    isVerified: false,
  });

  await newUser.save();

  await Email.sendOTPEmail(email, otp);

  return {
    message: "Registration successful! Please check your email for the OTP.",
    userId: newUser._id,
  };
};

exports.verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email }).select("otp otpExpiry");

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isVerified) {
    throw new Error("Account is already verified.");
  }

  if (user.otpExpiry < new Date()) {
    throw new Error("OTP expired. Please register again to receive a new OTP.");
  }

  if (user.otp != otp) {
    throw new Error("Invalid OTP.");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { message: "Email successfully verified. You can now log in." };
};

exports.resendOtp = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found or already verified.");
  }

  if (user.isVerified) {
    throw new Error("User not found or already verified.");
  }

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await Email.sendOTPEmail(email, otp);

  return {
    message: `New OTP successfully sent to ${email}.`,
  };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials or user not found.");
  }

  if (!user.isVerified) {
    throw new Error(
      "Account is not verified. Please check your email for the OTP."
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials or user not found.");
  }

  const token = generateToken(user._id);

  const userObject = user.toObject();

  delete userObject.password;

  return {
    user: userObject,
    token,
    message: "Login successful.",
  };
};

const generateToken = (id) => {
  return jwt.sign({ id }, AUTH_CONFIG.JWT_SECRET, {
    expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
  });
};

exports.forgotPasswordSendOtp = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found.");
  }

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await Email.sendForgotPasswordOTPEmail(email, otp);

  return {
    message: `Password reset OTP successfully sent to ${email}.`,
    email: user.email,
  };
};

exports.verifyForgotPasswordOtp = async (email, otp, newPassword) => {
  const user = await User.findOne({ email }).select(
    "+otp +otpExpiry +password"
  );

  if (!user) {
    throw new Error("Invalid email or OTP.");
  }

  if (!user.otp || !user.otpExpiry) {
    throw new Error("Password reset flow not initiated for this email.");
  }

  if (user.otpExpiry < new Date()) {
    throw new Error("OTP expired. Please restart the forgot password process.");
  }

  if (user.otp != otp) {
    throw new Error("Invalid email or OTP.");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return {
    message:
      "Password successfully reset. You can now log in with your new password.",
    userId: user._id,
  };
};

exports.changePassword = async (userId, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  return {
    message:
      "Password successfully changed. Please log in with your new password.",
    userId: user._id,
  };
};

exports.sendChangeEmailOtp = async (userId, newEmail) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Logged-in user not found.");
  }

  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser) {
    throw new Error("This email is already registered to another account.");
  }

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  user.tempEmail = newEmail;
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await Email.sendChangeEmailOTPEmail(newEmail, otp);

  return {
    message: `Verification OTP successfully sent to ${newEmail}.`,
    userId: user._id,
  };
};

exports.verifyChangeEmailOtp = async (userId, otp) => {
  const user = await User.findById(userId).select("+otp +otpExpiry +tempEmail");

  if (!user) {
    throw new Error("Logged-in user not found.");
  }

  if (!user.otp || !user.otpExpiry || !user.tempEmail) {
    throw new Error("Email change flow not initiated or completed.");
  }

  if (user.otpExpiry < new Date()) {
    throw new Error("OTP expired. Please restart the email change process.");
  }

  if (user.otp != otp) {
    throw new Error("Invalid OTP.");
  }

  user.email = user.tempEmail;
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.tempEmail = undefined;

  await user.save();

  return {
    message:
      "Email address successfully updated. You must log in again with your new email.",
    newEmail: user.email,
  };
};
