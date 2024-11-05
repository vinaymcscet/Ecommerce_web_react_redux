import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productHistory: [],
  productList: [],
  categorySlide: [],
  allCategories: [],
  homeProductData: [],
  homeProductSection: [],
  allCategoryList: [],
  subCategoryList: null,
  recentView: null,
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
    setHomeProductData: (state, action) => {
      const product = action.payload;
      state.homeProductData.push(product);
    },
    setAllCategoryList: (state, action) => {
      const product = action.payload;
      state.allCategoryList.push(product);
    },
    setSubCategoryList: (state, action) => {
      state.subCategoryList = action.payload;
    },
    setHomeProductSection: (state, action) => {
      const product = action.payload;
      state.homeProductSection.push(product);
    },
    setRecentView: (state, action) => {
      state.recentView = action.payload;
    },
  },
});

export const {
  setProductHistory,
  setProductList,
  setCategorySlide,
  setAllCategories,
  setHomeProductData,
  setHomeProductSection,
  setAllCategoryList,
  setSubCategoryList,
  setRecentView,
} = cartSlice.actions;
export default cartSlice.reducer;
