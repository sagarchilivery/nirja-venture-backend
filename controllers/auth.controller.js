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

  generateTokenAndSetCookie(
    { id: newUser._id, email: newUser.email, username: newUser.username },
    res
  );

  res.json(
    new ApiResponse(200, { username, email }, "User created successfully")
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

  generateTokenAndSetCookie(
    { id: user._id, email: user.email, username: user.username },
    res
  );

  res.json(new ApiResponse(200, { email, password }));
});

export const signout = async (req, res) => {
  res.clearCookie("token");
  res.json(new ApiResponse(200, {}, "User signed out successfully"));
};
