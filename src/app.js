import express from "express";

import cookieParser from "cookie-parser";

import cors from "cors";

import userRouter from "./routes/user.routes.js";

// i think error prone area
// import router from "./routes/healthcheck.routes.js";

import healthcheckRouter from "./routes/healthcheck.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

// common middleware
app.use(express.json({ limit: "900kb" }));
app.use(express.urlencoded({ extended: true, limit: "900kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export { app };
