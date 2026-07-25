import { createSlice } from "@reduxjs/toolkit"


const customerSlice = createSlice({
    name: 'customer',
    initialState: {
        customers: []
    },
    reducers: {
        setCustomers: (state, { payload }) => {
            state.customers = payload;
        }
    }
})


export const allCustomers = (state) => state.customer.customers;

export const { setCustomers } = customerSlice.actions;

export default customerSlice.reducer
