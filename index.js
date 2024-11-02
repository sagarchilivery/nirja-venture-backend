import express from "express";
import { configDotenv } from "dotenv";
configDotenv();

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import { AuthRoutes } from "./routes/auth.routes.js";
import { ArticleRoutes } from "./routes/article.routes.js";
import cookieParser from "cookie-parser";
import { adminRoutes } from "./routes/admin.routes.js";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", AuthRoutes);
app.use("/articles", ArticleRoutes);
app.use("/admin", adminRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI, { dbName: "Nirja_Ventures" })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
