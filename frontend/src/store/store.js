import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth.slice.js";
import customerReducer from "./features/customer.slice.js";
import reportReducer from "./features/report.slice.js";
import productReducer from "./features/product.slice.js";
import salesReducer from "./features/sales.slice.js";
import navReducer from "./features/nav.slice.js";
import billingReducer from "./features/billing.slice.js";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        customer: customerReducer,
        report: reportReducer,
        product: productReducer,
        sales: salesReducer,
        nav : navReducer,
        billing: billingReducer
    }
});


