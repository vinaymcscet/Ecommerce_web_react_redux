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
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
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
  },
});

export const { addToCart, setSelectedSize, setQuantity, clearCart, updateQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
