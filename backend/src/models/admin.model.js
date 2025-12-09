const mongoose = require("mongoose");

const AdminDataSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const AdminData = mongoose.model("Admin", AdminDataSchema);

module.exports = AdminData;
