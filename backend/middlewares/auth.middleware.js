import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import CONFIG from "../utils/config.js";
export const auth = async (req, res, next) => {
  try {
    const { token, deviceId } = req.body;

    const verified = jwt.verify(token, CONFIG.JWT_SECRET);

    let user = await User.findOne({ _id: verified.userId, deviceId: deviceId });

    if (!user) {
      return res.status(400).json({
        success: true,
        message: "you are not authenticated to send this request",
      });
    }

    req.user = user;
    next();
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
