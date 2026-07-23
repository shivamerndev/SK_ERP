import { NODE_ENV } from "../config/env.config.js";

export default (err, req, res, next) => {

    const isJwtError = err.name === "JsonWebTokenError" || err.name === "TokenExpiredError";
    const statusCode = err.statusCode || (isJwtError ? 401 : 500);
    const message = isJwtError ? "Session expired or invalid token" : (err.message || "Internal Server Error");

    res.status(statusCode).json({
        success: false,
        message,
        ...(NODE_ENV === "development" && { stack: err.stack }),
    });
}