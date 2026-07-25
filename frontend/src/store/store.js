import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth.slice.js";
import customerReducer from "./features/customer.slice.js";

export const store = configureStore({ reducer: { auth: authReducer, customer: customerReducer } });
