import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  viewCartItems: null,
  selectedSize: null,
  quantity: 1, // Default quantity
  createOrderResponse: null,
  confirmOrderResponse: null,
  orderList: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      state.cartItems.push(product);
    },
    setViewCartItems: (state, action) => {
      state.viewCartItems = action.payload;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.viewCartItems.cartItems.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    setCreateOrderResponse: (state, action) => {
      state.createOrderResponse = action.payload;
    },
    setConfirmOrderResponse: (state, action) => {
      state.confirmOrderResponse = action.payload;
    },
    setOrderListResponse: (state, action) => {
      state.orderList = action.payload;
    },
  },
});

export const { 
  addToCart, 
  setViewCartItems, 
  setSelectedSize, 
  setQuantity, 
  clearCart, 
  updateQuantity, 
  removeItem,
  setCreateOrderResponse,
  setConfirmOrderResponse,
  setOrderListResponse,
} = cartSlice.actions;
export default cartSlice.reducer;
