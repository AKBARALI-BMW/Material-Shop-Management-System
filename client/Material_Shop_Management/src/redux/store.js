import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import settingsReducer from "./settingsSlice"; 
import productReducer  from "./productSlice";  


export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        products: productReducer,
    },
});

