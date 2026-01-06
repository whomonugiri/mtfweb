import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.controller.js";
import { autoLogin, updateProfile } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 }, // 500KB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/autologin", autoLogin);

router.post(
  "/updateProfile",
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "signatureImage", maxCount: 1 },
  ]),
  auth,
  updateProfile
);

export default router;
