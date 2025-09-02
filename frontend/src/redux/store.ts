import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { apiSlice } from './slices/apiSlice';
import cartReducer from "./slices/cartSlice"
import locationReducer from "./slices/locationSlice"


const store = configureStore({
    reducer: {
        auth: authReducer, 
        cart: cartReducer,
        location:locationReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
          .concat(apiSlice.middleware)
});

export default store;

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store