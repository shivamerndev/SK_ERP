import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
    name: "nav",
    initialState: {
        results: []
    },
    reducers: {
        setResults: (state, action) => {
            state.results = action.payload;
        }
    }
});

export const { setResults } = navSlice.actions;
export default navSlice.reducer