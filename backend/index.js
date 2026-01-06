import express from "express";
import CONFIG from "./utils/config.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimiter from "express-rate-limit";
import mongoose from "mongoose";
import router from "./routes/route.js";

const app = express();
app.use(helmet());
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limterConfig = {
  windowMs: 1 * 60 * 1000,
  limit: 60,
  message:
    "due to some unusual activity your ip address is blocked, try again after some time",
};

app.use(rateLimiter(limterConfig));

const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false,
};

app.use(cors(corsConfig));

app.use("/uploads", express.static("uploads"));

app.use("/api/user/v1", router);

mongoose
  .connect(CONFIG.MONGODB_URI)
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("Datbase is not connecetd", error));

app.listen(CONFIG.PORT, () => {
  console.log("server is running at http://localhost:" + CONFIG.PORT);
});
