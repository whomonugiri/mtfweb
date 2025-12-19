import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.controller.js";
import { autoLogin, updateProfile } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/autologin", autoLogin);

router.use(auth);

router.post("/updateProfile", updateProfile);

export default router;
