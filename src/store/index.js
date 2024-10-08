import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slice/modalSlice";
import cartReducer from './slice/cartSlice';
import productReducer from './slice/productSlice';
import userReducer from './slice/userSlice'

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    cart: cartReducer,
    product: productReducer,
    user: userReducer
  },
});