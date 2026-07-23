import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.config.js"


const generateAccessToken = (id) => {
    return jwt.sign({ id, type: "access" }, JWT_SECRET, { expiresIn: "15m" })
}

const generateRefreshToken = (id) => {
    return jwt.sign({ id, type: "refresh" }, JWT_SECRET, { expiresIn: "7d" })
}

const verifyToken = (token, type) => {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.type !== type) throw new jwt.JsonWebTokenError("Invalid token type")
    return payload
}

const createHttpOnlyTokenCookie = (token) => ({
    token,
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
})

const verifyAccessToken = (token) => verifyToken(token, "access")
const verifyRefreshToken = (token) => verifyToken(token, "refresh")

const clearRefreshCookie = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
})

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, createHttpOnlyTokenCookie, clearRefreshCookie }