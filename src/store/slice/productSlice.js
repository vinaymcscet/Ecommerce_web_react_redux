import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productHistory: [],
  productList: [],
  categorySlide: [],
  allCategories: [],
};

export const cartSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductHistory: (state, action) => {
      const product = action.payload;
      state.productHistory.push(product);
    },
    setProductList: (state, action) => {
      const product = action.payload;
      state.productList.push(product);
    },
    setCategorySlide: (state, action) => {
      const product = action.payload;
      state.categorySlide.push(product);
    },
    setAllCategories: (state, action) => {
      const product = action.payload;
      state.allCategories.push(product);
    },
  },
});

export const { setProductHistory, setProductList, setCategorySlide, setAllCategories } =
  cartSlice.actions;
export default cartSlice.reducer;
