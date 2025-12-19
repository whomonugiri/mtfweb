import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import CONFIG from "../utils/config.js";
import { validateProfile } from "../utils/helper.js";

export const autoLogin = async (req, res) => {
  try {
    const { token, deviceId } = req.body;

    const verified = jwt.verify(token, CONFIG.JWT_SECRET);

    let user = await User.findOne({ _id: verified.userId, deviceId: deviceId });

    // OTP is correct → Find or create user

    if (!user) {
      return res.status(400).json({
        success: true,
        message: "you need to login to your account",
      });
    }

    const newtoken = jwt.sign({ userId: user._id }, CONFIG.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,

      data: user,
      token: newtoken,
      deviceId: deviceId,
    });
  } catch (error) {
    console.error(error);
    const message = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({
      success: false,
      message: message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware

    const { fullName, emailId, brandName, address, GSTNO, MSME } = req.body;

    // Validate input
    const { error, isValid } = validateProfile(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    // Check email uniqueness (if changed)
    const existingEmail = await User.findOne({
      emailId,
      _id: { $ne: userId },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        emailId,
        brandName,
        address,
        GSTNO: GSTNO || "",
        MSME: MSME || "",
      },
      { new: true }
    ).select("-password");

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    const message = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({
      success: false,
      message: message,
    });
  }
};
