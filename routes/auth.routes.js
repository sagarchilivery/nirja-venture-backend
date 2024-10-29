import express from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";

export const AuthRoutes = express.Router();

AuthRoutes.post("/signup", signup);

AuthRoutes.post("/signin", signin);

AuthRoutes.post("/signout", signout);