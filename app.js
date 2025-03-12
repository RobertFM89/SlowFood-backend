
import dotenv from "dotenv";
dotenv.config();

import connect from "./db/index.js";

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
import express from "express";

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
import configureMiddleware from "./config/index.js";
configureMiddleware(app);

// 👇 Start handling routes here
import indexRoutes from "./routes/index.routes.js";
app.use("/api", indexRoutes);

import authRoutes from "./routes/auth.routes.js";
app.use("/auth", authRoutes);

import recipeRoutes from "./routes/recipe.routes.js";
app.use("/api", recipeRoutes);

import userRoutes from "./routes/user.routes.js";
app.use("/api", userRoutes);

import commentRoutes from "./routes/comment.routes.js";
app.use("/api", commentRoutes);

import uploadRoutes from "./routes/upload.routes.js";
app.use("/api", uploadRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
import errorHandling from "./error-handling/index.js";
errorHandling(app);

export default app;