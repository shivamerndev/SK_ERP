import { api } from "../utils/axios.utils.js"

const loginService = async (credentials) => {
    let res = await api.post("/auth/login", credentials);
    return res.data.data;
}

const registerService = async (userData) => {
    let res = await api.post("/auth/register", userData);
    return res.data.data;
}

const getUserService = () => api.get("/auth/user")

const logoutService = () => api.post("/auth/logout")

const refreshTokenService = () => api.post("/auth/refresh-token")


export { getUserService, logoutService, refreshTokenService, loginService, registerService }