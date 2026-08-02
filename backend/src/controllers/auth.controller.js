import { getUser, loginService, registerService, refreshService } from "../services/auth.service.js";
import { clearRefreshCookie } from "../utils/token.utils.js";
import { asyncHandler } from "../utils/asyncHanlder.utils.js"


const register = asyncHandler(async (req, res) => {
    const { accessToken, httpOnly, user } = await registerService(req.body);
    res.cookie("refresh_token", httpOnly.token, httpOnly.options);
    res.success(201, "Registration Successful.", { accessToken, user });
});

const login = asyncHandler(async (req, res) => {
    const { accessToken, httpOnly, user } = await loginService(req.body);
    res.cookie("refresh_token", httpOnly.token, httpOnly.options);
    res.success(200, "Login Successful.", { accessToken, user });
});


const loggedInUser = asyncHandler(async (req, res) => {

    let user = await getUser(req.user.id)

    res.success(200, "User Fetched Successfully", user)
})

const refreshToken = asyncHandler(async (req, res) => {
    const { accessToken, user } = await refreshService(req.cookies.refresh_token)
    res.success(200, "Token refreshed successfully.", { accessToken, user })
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("refresh_token", clearRefreshCookie())
    res.success(200, "Logged out successfully.")
})

export { register, login, loggedInUser, refreshToken, logout }