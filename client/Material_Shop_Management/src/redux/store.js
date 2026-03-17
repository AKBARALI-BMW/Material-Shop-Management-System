import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import settingsReducer from "./settingsSlice"; 
import productReducer  from "./productSlice"; 
import customerReducer from "./customerSlice"; 
import inventoryReducer from "./inventorySlice"; 
import orderReducer     from "./orderSlice"; 



export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        products: productReducer,
         customers: customerReducer,
         inventory: inventoryReducer, 
         orders:    orderReducer,


    },
});

