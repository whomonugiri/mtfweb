import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      default: "",
      trim: true,
    },
    emailId: {
      type: String,
      default: "",
      trim: true,
    },
    brandName: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    GSTNO: {
      type: String,
      default: "",
      trim: true,
    },
    MSME: {
      type: String,
      default: "",
      trim: true,
    },
    companyLogo: {
      type: String,
      default: "",
      trim: true,
    },
    signatureImage: {
      type: String,
      default: "",
      trim: true,
    },
    deviceId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
