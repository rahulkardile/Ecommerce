import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./API/UserApi";
import { UserSlice } from "./Slices/UserSlice";
import { ProductAPI } from "./API/Product";
import { CartSlice } from "./Slices/CartSlice.ts";
import { OrderApi } from "./API/OrderApi.ts";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [ProductAPI.reducerPath]: ProductAPI.reducer,
        [OrderApi.reducerPath]: OrderApi.reducer, 
        [UserSlice.name]: UserSlice.reducer,
        [CartSlice.name]: CartSlice.reducer,
    },
    middleware: (mid) => [ ...mid(), userApi.middleware, ProductAPI.middleware, OrderApi.middleware ],

})

export type RootStates = ReturnType<typeof store.getState>