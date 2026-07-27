import { createSlice } from "@reduxjs/toolkit";

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    salesRecords: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setSalesRecords: (state, { payload }) => {
      state.salesRecords = payload;
      state.isLoading = false;
      state.error = null;
    },
    setSalesLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setSalesError: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    addSaleRecord: (state, { payload }) => {
      state.salesRecords.unshift(payload);
    },
    deleteSaleRecord: (state, { payload }) => {
      state.salesRecords = state.salesRecords.filter(s => s._id !== payload);
    }
  }
});

export const { setSalesRecords, setSalesLoading, setSalesError, addSaleRecord, deleteSaleRecord } = salesSlice.actions;
export default salesSlice.reducer;
