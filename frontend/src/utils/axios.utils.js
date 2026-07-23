import axios from "axios"
import { store } from "../store/store"
import { logout, setAccessToken, setUser } from "../store/features/auth.slice.js"

export let baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api/v1";


export const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})



let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};


api.interceptors.request.use(config => {

    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;

}, (error) => Promise.reject(error)
);



api.interceptors.response.use(response => response, async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

        if (originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/refresh-token")) {
            store.dispatch(logout());
            return Promise.reject(error);
        }


        if (isRefreshing) {

            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            }).catch((err) => {
                return Promise.reject(err);
            });
        }


        originalRequest._retry = true;
        isRefreshing = true;


        return new Promise((resolve, reject) => {
            api.post("/auth/refresh-token").then((res) => {
                const newAccessToken = res.data.data.accessToken;
                store.dispatch(setAccessToken(newAccessToken));
                if (res.data.data.user) {
                    store.dispatch(setUser(res.data.data.user));
                }
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                resolve(api(originalRequest));
            }).catch((err) => {
                store.dispatch(logout());
                processQueue(err, null);
                reject(err);
            }).finally(() => {
                isRefreshing = false;
            });
        });
    }

    return Promise.reject(error);
});