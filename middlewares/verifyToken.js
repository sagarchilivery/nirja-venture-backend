import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../helpers/error_handler.js";
import asyncHandler from "../helpers/async_handler.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json(
        new ApiError(401, null, "Unauthorized - No token provided")
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.json(new ApiError(401, null, "Unauthorized - Invalid token"));
    }

    const user = await User.findById(decoded.data.id).select("-password");

    if (!user) {
      return res.json(new ApiError(404, null, "User not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    return res.json(new ApiError(500, null, "Internal server error"));
  }
});

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.json(
      new ApiError(401, null, "Unauthorized - No user authenticated")
    );
  }

  const role = req.user.role;
  if (role !== "admin") {
    return res.json(new ApiError(403, null, "Forbidden - Admin access only"));
  }

  next();
});
