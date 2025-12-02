import axios from "axios";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import CONFIG from "../utils/config.js";
import jwt from "jsonwebtoken";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOtp = async (req, res) => {
  try {
    console.log(req);
    const mobileNumber = req.body?.mobileNumber;

    // 10-digit numeric validation
    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number. It must be a 10-digit numeric value.",
        data: req.body,
      });
    }

    const otpValue = generateOTP();

    const otpApiUrl = "https://meraotp.in/api/sendSMS";
    const otpApiData = {
      apiKey: CONFIG.MERAOTP_API_KEY,
      senderId: "MRAOTP",
      messageType: "AUTH_OTP",
      mobileNo: mobileNumber,
      brandName: "MTFONLINE",
      otp: otpValue,
    };

    const otpApiHeaders = { "Content-Type": "application/json" };

    const otpApiResponse = await axios.post(otpApiUrl, otpApiData, {
      headers: otpApiHeaders,
    });

    // Save OTP in DB
    const otp = await OTP.create({
      mobileNumber,
      otp: otpValue,
    });

    return res.status(200).json({
      success: true,
      message: "6 digit OTP sent to your mobile number",
      otpRef: otp._id,
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

export const verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, otp, otpRef } = req.body;

    // Validate mobile number
    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number. It must be a 10-digit numeric value.",
      });
    }

    // Validate OTP
    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP exists in database
    const otpRecord = await OTP.findById(otpRef);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Check OTP match
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    // OTP is correct → Find or create user
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      user = await User.create({ mobileNumber });
    }

    const deviceId = crypto.randomUUID();
    const token = jwt.sign({ userId: user._id }, CONFIG.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.deviceId = deviceId;
    await user.save();

    // OPTIONAL: Delete used OTP record
    await OTP.findByIdAndDelete(otpRef);

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      data: user,
      token: token,
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
