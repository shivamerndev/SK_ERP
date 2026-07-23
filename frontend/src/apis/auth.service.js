import { api } from "../utils/axios.utils.js"


const googleAuthService = async (idToken) => {
    let res = await api.post("/auth/google", { idToken });
    return res.data.data;
}


const getUserService = () => api.get("/auth/user")

const logoutService = () => api.post("/auth/logout")

const refreshTokenService = () => api.post("/auth/refresh-token")


export { getUserService, logoutService, refreshTokenService, googleAuthService }