import { createUser, findUserByEmail, findUserById, updateUserById } from "../repository/user.dao.js";
import { AppError } from "../utils/error.utils.js";
import { createHttpOnlyTokenCookie, generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.utils.js"
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../config/env.config.js";


const client = new OAuth2Client(GOOGLE_CLIENT_ID);


export const googleService = async (idToken) => {

    if (!idToken) throw new AppError(400, "Id Token Must be Provided.")

    const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });

    const payload = ticket.getPayload();

    const { name: fullName, email, sub: googleId, picture: avatar } = payload;

    let user = await findUserByEmail(email);

    if (!user) {
        user = await createUser({ fullName, email, googleId, avatar });
    } else if (!user.googleId || (avatar && user.avatar !== avatar)) {
        user = await updateUserById(user._id, { googleId, avatar: avatar || user.avatar });
    }

    const accessToken = generateAccessToken(user._id)
    const httpOnly = createHttpOnlyTokenCookie(generateRefreshToken(user._id))

    return { accessToken, httpOnly, user }
}

export const refreshService = async (refreshToken) => {
    if (!refreshToken) throw new AppError(401, "Refresh token is required.")
    const { id } = verifyRefreshToken(refreshToken)
    const user = await findUserById(id)
    if (!user) throw new AppError(401, "User no longer exists.")
    return { accessToken: generateAccessToken(user._id), user }
}


export const getUser = async (userId) => {
    const user = await findUserById(userId)
    if (!user) throw new AppError(404, "user not found.")

    return user;
}