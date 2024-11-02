import { isValidObjectId } from "mongoose";
import asyncHandler from "../helpers/async_handler.js";
import { ApiResponse } from "../helpers/response_handler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../helpers/error_handler.js";

export const reFillCredits = asyncHandler(async (req, res) => {
  const { id, credits } = req.body;

  if (!id) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (credits === undefined || typeof credits !== "number" || credits < 0) {
    throw new ApiError(400, "Please provide a valid number of credits");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Add the provided credits to the current credits
  user.credits += credits;
  await user.save();

  res.json(new ApiResponse(200, user, "Credits refilled successfully"));
});

export const deductCredits = asyncHandler(async (req, res) => {
  let { id, credits } = req.body;

  if (!id) {
    throw new ApiError(400, "Invalid user id");
  }

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid user id");
  }

  if (!credits) {
    throw new ApiError(400, "Please provide credits");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (credits < 0) {
    throw new ApiError(400, "Please provide a valid number of credits");
  }

  if (user.credits < credits) {
    credits = user.credits;
  }

  user.credits -= credits;
  await user.save();

  res.json(new ApiResponse(200, user, "Credits deducted successfully"));
});

export const findAllUsersWithCredits = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Find users with pagination and select all fields except password
  const users = await User.find({}).select("-password").skip(skip).limit(limit);

  // Count total users to calculate the total number of pages
  const totalUsers = await User.countDocuments({});
  const totalPages = Math.ceil(totalUsers / limit);

  res.json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalPages,
        currentPage: page,
        users,
      },
      "Users with credits retrieved successfully"
    )
  );
});
