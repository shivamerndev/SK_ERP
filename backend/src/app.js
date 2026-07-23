import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRouter from "./routes/auth.routes.js";

import errorMiddleware from "./middlewares/reject.middleware.js";
import responseMiddleware from "./middlewares/response.middleware.js";
import { FRONTEND_URL } from "./config/env.config.js";

const app = express();

app.use(morgan("dev"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	if (req.method === "OPTIONS") return res.sendStatus(204);
	next();
});

app.use(responseMiddleware);

app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

export default app;