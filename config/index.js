// We reuse this import in order to have access to the `body` property in requests
import express from "express";
import logger from "morgan";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "mongoose";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

connect(MONGO_URI)
  .then((x) => {
    const dbName = `${x.connections[0].name}`;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";

// Middleware configuration
const configureMiddleware = (app) => {
  // Because this will be hosted on a server that will accept requests from outside and it will be hosted ona server with a `proxy`, express needs to know that it should trust that setting.
  // Services like Fly use something called a proxy and you need to add this to your server
  app.set("trust proxy", 1);

  // controls a very specific header to pass headers from the frontend
  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  );

  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

export default configureMiddleware;