import { isValidObjectId } from "mongoose";
import asyncHandler from "../helpers/async_handler.js";
import { ApiError } from "../helpers/error_handler.js";
import { ApiResponse } from "../helpers/response_handler.js";
import { Article } from "../models/article.model.js";
import { User } from "../models/user.model.js";

// Create and Save a new Article
export const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { id, email, username } = req.user;

  // Validate request
  if (!title) {
    throw new ApiError(400, "Title can not be empty!");
  }

  if (!content) {
    throw new ApiError(400, "Content can not be empty!");
  }

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid user id");
  }

  // Find the user and check credits
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.credits <= 0) {
    throw new ApiError(403, "Insufficient credits to create an article");
  }

  // Create a Article
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    author: id,
  });

  if (!article) {
    throw new ApiError(400, "Error creating article");
  }

  // Save Article in the database
  await article.save();

  // Decrement credits by 1
  user.credits -= 1;
  await user.save();

  res.json(new ApiResponse(201, article, "Article created successfully"));
});

// Retrieve all Articles from the database.
export const findAllArticles = asyncHandler(async (req, res) => {
  const title = req.query.title;
  const condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  ``;

  const articles = await Article.find(condition)
    .populate("author", "-password -credits")
    .sort({ createdAt: -1 });

  if (!articles) {
    throw new ApiError(404, "Articles not found");
  }

  res.json(new ApiResponse(200, articles, "Articles retrieved successfully"));
});

// Find a single Article with an id
export const findOneArticle = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid article id");
  }

  const article = await Article.findById(id).populate(
    "author",
    "-password -credits"
  );

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  res.json(new ApiResponse(200, article, "Article retrieved successfully"));
});

// Update an Article by the id in the request
export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid user id");
  }

  const articleId = req.params.id;

  if (!isValidObjectId(articleId)) {
    throw new ApiError(400, "Invalid article id");
  }

  const article = await Article.findById(articleId);

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  if (article.author.toString() !== id) {
    throw new ApiError(403, "You are not authorized to update this article");
  }

  // Update fields if they are present in the request body
  const { title, content } = req.body;

  if (title) {
    article.title = title;
  }

  if (content) {
    article.content = content;
  }

  // Save the updated article
  await article.save();

  res.json(new ApiResponse(200, article));
});

// Delete a Article with the specified id in the request
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const articleId = req.params.id;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid user id");
  }

  if (!isValidObjectId(articleId)) {
    throw new ApiError(400, "Invalid article id");
  }

  const article = await Article.findById(articleId);

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  if (article.author.toString() !== id) {
    throw new ApiError(403, "You are not authorized to delete this article");
  }

  await Article.findByIdAndDelete(articleId);

  res.json(new ApiResponse(200, null, "Article deleted successfully"));
});

export const getUserArticles = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const articles = await Article.find({ author: userId })
    .populate("author", "-password -credits")
    .sort({ createdAt: -1 });

  if (!articles) {
    throw new ApiError(404, "Articles not found");
  }

  res.json(
    new ApiResponse(200, articles, "User articles retrieved successfully")
  );
});
