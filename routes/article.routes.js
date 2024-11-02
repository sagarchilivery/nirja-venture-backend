import express from "express";

import {
  createArticle,
  deleteArticle,
  findAllArticles,
  findOneArticle,
  getUserArticles,
  updateArticle,
} from "../controllers/article.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import apiLimiter from "../middlewares/rateLimit.js";

export const ArticleRoutes = express.Router();

ArticleRoutes.post("/", apiLimiter, verifyToken, createArticle);
ArticleRoutes.get("/", findAllArticles);
ArticleRoutes.get("/:id", findOneArticle);
ArticleRoutes.put("/:id", verifyToken, updateArticle);
ArticleRoutes.delete("/:id", verifyToken, deleteArticle);
ArticleRoutes.get("/user/:id", getUserArticles);
