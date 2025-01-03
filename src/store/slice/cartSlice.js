import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  viewCartItems: null,
  selectedSize: null,
  quantity: 1, // Default quantity
  createOrderResponse: null,
  confirmOrderResponse: null,
  orderList: null,
  activeOrderListCount: 0,
  orderDetail: null,
  reasonList: null,
  selectedReasonCancelProduct: null,
  isCancelModalOpen: false,
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
    setActiveOrderListCountResponse: (state, action) => {
      state.activeOrderListCount = action.payload;
    },
    setOrderDetailResponse: (state, action) => {
      state.orderDetail = action.payload;
    },
    setReasonListResponse: (state, action) => {
      state.reasonList = action.payload;
    },
    setSelectedReasonCancelProductResponse: (state, action) => {
      state.selectedReasonCancelProduct = action.payload;
    },
    setCancelOrderModal: (state, action) => {
      state.isCancelModalOpen = action.payload.isOpen;
      state.orderId = action.payload.orderId;
      state.skuId = action.payload.skuId;
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
  setOrderDetailResponse,
  setReasonListResponse,
  setSelectedReasonCancelProductResponse,
  setActiveOrderListCountResponse,
  setCancelOrderModal,
} = cartSlice.actions;
export default cartSlice.reducer;
