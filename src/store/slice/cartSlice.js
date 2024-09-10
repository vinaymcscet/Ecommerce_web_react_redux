import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  selectedSize: null,
  quantity: 1, // Default quantity
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      state.cartItems.push(product);
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
  },
});

export const { addToCart, setSelectedSize, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
