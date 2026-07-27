import { createSlice } from "@reduxjs/toolkit";

const reportSlice = createSlice({
    name: "report",
    initialState: {
        reports: [],
        selectedBill : null
    },
    reducers: {
        setReports: (state, action) => {
            state.reports = action.payload;
        },
        setSelectedBill : (state , action) => {
            state.selectedBill = action.payload
        }
    }
});

export const { setReports , setSelectedBill } = reportSlice.actions;
export default reportSlice.reducer