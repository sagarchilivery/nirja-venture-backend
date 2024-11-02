import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/verifyToken.js";
import {
  deductCredits,
  findAllUsersWithCredits,
  reFillCredits,
} from "../controllers/admin.controller.js";
import apiLimiter from "../middlewares/rateLimit.js";

export const adminRoutes = express.Router();

adminRoutes.get(
  "/get-all-users",
  verifyToken,
  verifyAdmin,
  findAllUsersWithCredits
);

adminRoutes.put(
  "/add-credits",
  apiLimiter,
  verifyToken,
  verifyAdmin,
  reFillCredits
);

adminRoutes.put("/deduct-credits", verifyToken, verifyAdmin, deductCredits);
