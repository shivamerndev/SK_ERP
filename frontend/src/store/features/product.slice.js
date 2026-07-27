import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        selectedProduct: null,
    },
    reducers: {
        setProducts: (state, { payload }) => {
            state.products = payload;
        },
        setSelectedProduct: (state, { payload }) => {
            state.selectedProduct = payload;
        }
    }
});

export const { setProducts, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;