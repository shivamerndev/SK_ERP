import { createSlice } from "@reduxjs/toolkit";

const reportSlice = createSlice({
    name: "report",
    initialState: {
        history: [],
    },
    reducers: {
        setHistory: (state, action) => {
            state.history = action.payload;
        }
    }
});

export const { setHistory } = reportSlice.actions;
export default reportSlice.reducer