import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import CONFIG from "../utils/config.js";

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

    const newdeviceId = crypto.randomUUID();
    const newtoken = jwt.sign({ userId: user._id }, CONFIG.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.deviceId = newdeviceId;
    await user.save();

    return res.status(200).json({
      success: true,

      data: user,
      token: newtoken,
      deviceId: newdeviceId,
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
