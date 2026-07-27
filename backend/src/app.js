import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

import authRouter from "./routes/auth.routes.js";
import customerRouter from "./routes/customer.routes.js";
import billingRouter from "./routes/billing.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

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
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	if (req.method === "OPTIONS") return res.sendStatus(204);
	next();
});

app.use(responseMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/billing", billingRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(express.static(path.resolve("dist")));


app.get("*client", (req, res, next) => {
	if (req.path.startsWith("/api")) {
		return next();
	}
	res.sendFile(path.resolve("dist", "index.html"));
});

app.use(errorMiddleware);

export default app;