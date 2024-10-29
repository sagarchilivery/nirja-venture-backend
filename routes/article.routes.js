import express from "express";

import VerifyToken from "../middlewares/verifyToken.js";
import {
  createArticle,
  deleteArticle,
  findAllArticles,
  findOneArticle,
  getUserArticles,
  updateArticle,
} from "../controllers/article.controller.js";

export const ArticleRoutes = express.Router();

ArticleRoutes.post("/", VerifyToken, createArticle);
ArticleRoutes.get("/", findAllArticles);
ArticleRoutes.get("/:id", findOneArticle);
ArticleRoutes.put("/:id", VerifyToken, updateArticle);
ArticleRoutes.delete("/:id", VerifyToken, deleteArticle);
ArticleRoutes.get("/user/:id", getUserArticles);
