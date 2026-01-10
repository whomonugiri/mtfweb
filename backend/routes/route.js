import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.controller.js";
import { autoLogin, updateProfile } from "../controllers/user.controller.js";
import {
  addClient,
  updateClient,
  deleteClient,
  getClient,
  getAllClients,
  searchClients,
} from "../controllers/client.controller.js";
import {
  addProject,
  updateProject,
  deleteProject,
  getProject,
  getAllProjects,
  addProjectLog,
  getPublicProject,
} from "../controllers/project.controller.js";
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

// Client routes
router.post("/addClient", auth, addClient);
router.post("/updateClient", auth, updateClient);
router.post("/deleteClient", auth, deleteClient);
router.post("/getClient", auth, getClient);
router.get("/getAllClients", auth, getAllClients);
router.get("/searchClients", auth, searchClients);

// Project routes
router.post("/addProject", auth, addProject);
router.post("/updateProject", auth, updateProject);
router.post("/deleteProject", auth, deleteProject);
router.post("/getProject", auth, getProject);
router.get("/getAllProjects", auth, getAllProjects);
router.post("/addProjectLog", auth, addProjectLog);

// Public project route (no auth required)
router.get("/public/project/:projectId", getPublicProject);

export default router;
