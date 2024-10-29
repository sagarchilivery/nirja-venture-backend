import { isValidObjectId } from "mongoose";
import asyncHandler from "../helpers/async_handler.js";
import {
  cypherPassword,
  decypherPassword,
} from "../helpers/cypher_decypher.js";
import { ApiError } from "../helpers/error_handler.js";
import { ApiResponse } from "../helpers/response_handler.js";
import generateTokenAndSetCookie from "../helpers/token.js";
import { User } from "../models/user.model.js";

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const newUser = new User({
    username,
    email,
    password: await cypherPassword(password),
  });

  if (!newUser) {
    throw new ApiError(400, "Error creating user");
  }

  await newUser.save();

  const token = generateTokenAndSetCookie(
    { id: newUser._id, email: newUser.email, username: newUser.username },
    res
  );

  res.json(
    new ApiResponse(
      200,
      {
        user: { username, email, id: newUser._id, credits: newUser.credits },
        token,
      },
      "User created successfully"
    )
  );
});

export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isMatch = await decypherPassword(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = generateTokenAndSetCookie(
    { id: user._id, email: user.email, username: user.username },
    res
  );

  res.json(
    new ApiResponse(
      200,
      {
        user: {
          email,
          username: user.username,
          id: user._id,
          credits: user.credits,
        },
        token,
      },
      "User signed in successfully"
    )
  );
});

export const signout = async (req, res) => {
  res.clearCookie("token");
  res.json(new ApiResponse(200, {}, "User signed out successfully"));
};

export const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await User.findById(userId).select("-password -credits");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(new ApiResponse(200, user, "User details retrieved successfully"));
});
