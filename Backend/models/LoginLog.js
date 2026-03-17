const mongoose = require("mongoose");
const { Schema } = mongoose;

const loginLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ["patient", "doctor", "admin", "unknown"],
      required: true,
      default: "unknown",
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    sessionDuration: {
      type: Number, // in seconds
      default: null,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: null,
    },
    location: {
      country: { type: String },
      city: { type: String },
      region: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      isp: { type: String },
    },
    deviceInfo: {
      deviceType: { type: String }, // mobile, tablet, desktop
      browser: { type: String },
      operatingSystem: { type: String },
    },
    loginStatus: {
      type: String,
      enum: ["success", "failed", "suspicious"],
      default: "success",
    },
    failureReason: {
      type: String,
      default: null,
    },
    isRiskySuspicious: {
      type: Boolean,
      default: false,
    },
    riskFactors: {
      type: [String], // array of risk factors like "new device", "unusual location", "unusual time"
      default: [],
    },
  },
  { timestamps: true }
);

// Index for faster queries
loginLogSchema.index({ userId: 1, loginTime: -1 });
loginLogSchema.index({ ipAddress: 1 });
loginLogSchema.index({ loginTime: -1 });

module.exports = mongoose.model("LoginLog", loginLogSchema);
