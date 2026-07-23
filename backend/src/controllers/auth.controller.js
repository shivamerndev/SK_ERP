import { getUser, googleService, refreshService } from "../services/auth.service.js";
import { clearRefreshCookie } from "../utils/token.utils.js";
import { asyncHandler } from "../utils/asyncHanlder.utils.js"


const googleAuth = asyncHandler(async (req, res) => {

    const { idToken } = req.body;

    let { accessToken, httpOnly, user } = await googleService(idToken)
    res.cookie("refresh_token", httpOnly.token, httpOnly.options)

    res.success(200, "Authentication Successfully.", { accessToken, user })
})


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

export { loggedInUser, googleAuth, refreshToken, logout }