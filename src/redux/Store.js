import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartSlice";
import filterReducer from "./slice/filterSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    filter: filterReducer
  }
});