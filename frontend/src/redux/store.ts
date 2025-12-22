import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import locationReducer from "./slices/locationSlice";
import restaurantReducer from "./slices/restaurantSlie";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    location: locationReducer,
    restaurant: restaurantReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
