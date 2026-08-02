import { createUser, findUserByEmail, findUserByEmailWithPassword, findUserById } from "../repository/user.dao.js";
import { AppError } from "../utils/error.utils.js";
import { createHttpOnlyTokenCookie, generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.utils.js"
import authValidator from "../validator/auth.validator.js";


export const registerService = async (userData) => {
    const { error } = authValidator(userData).register;
    if (error) {
        throw new AppError(400, error.details[0].message);
    }

    const { fullName, email, password } = userData;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError(409, "User with this email already exists.");
    }

    const user = await createUser({ fullName, email, password });

    const userObj = user.toObject();
    delete userObj.password;

    const accessToken = generateAccessToken(user._id);
    const httpOnly = createHttpOnlyTokenCookie(generateRefreshToken(user._id));

    return { accessToken, httpOnly, user: userObj };
};

export const loginService = async (credentials) => {
    const { error } = authValidator(credentials).login;
    if (error) {
        throw new AppError(400, error.details[0].message);
    }

    const { email, password } = credentials;

    const user = await findUserByEmailWithPassword(email);
    if (!user) {
        throw new AppError(401, "Invalid email or password.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError(401, "Invalid email or password.");
    }

    const userObj = user.toObject();
    delete userObj.password;

    const accessToken = generateAccessToken(user._id);
    const httpOnly = createHttpOnlyTokenCookie(generateRefreshToken(user._id));

    return { accessToken, httpOnly, user: userObj };
};

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