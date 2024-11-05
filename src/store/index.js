import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import modalReducer from "./slice/modalSlice";
import cartReducer from './slice/cartSlice';
import productReducer from './slice/productSlice';
import userReducer from './slice/userSlice'
import cmsReducer from './slice/cmsSlice'

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    cart: cartReducer,
    product: productReducer,
    user: userReducer,
    cms: cmsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});