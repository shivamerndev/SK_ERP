import { createSlice } from "@reduxjs/toolkit"


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        isLoading: true,
        initialized: false
    },
    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload;
            state.isLoading = false;
            state.initialized = true;
        },
        setAccessToken: (state, { payload }) => {
            state.accessToken = payload;
        },
        setAuthLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        setInitialized: (state, { payload }) => {
            state.initialized = payload;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isLoading = false;
            state.initialized = true;
        }
    }
})


export const { setUser, setAccessToken, setAuthLoading, setInitialized, logout } = authSlice.actions;

export default authSlice.reducer