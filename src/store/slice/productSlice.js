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
  search: [],
  total: 0,
  totalRecentView: 0,
  totalFilterList: null,
  totalProductListCount: 0,
  totalAddressCount: 0,
  totalWishlistCount: 0,
  productDetailResponse: null,
  offerList: null,
  addWishlist: null,
  listWishlist: null,
  userReview: null,
  userReviewCount: 0,
  getReview: null,
  getReviewCount: 0,
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
      state.productList = action.payload || [];
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
    setSearch: (state, action) => {
      state.search = action.payload || [];
    },
    setTotalResults: (state, action) => {
      state.total = action.payload;
    },
    setTotalRecentViewResults: (state, action) => {
      state.totalRecentView = action.payload;
    },
    setTotalProductListCount: (state, action) => {
      state.totalProductListCount = action.payload;
    },
    setTotalFilterList: (state, action) => {
      state.totalFilterList = action.payload;
    },
    setProductDetailResponse: (state, action) => {
      state.productDetailResponse = action.payload;
    },
    setTotalAddressCount: (state, action) => {
      state.totalAddressCount = action.payload;
    },
    setTotalWishlistCount: (state, action) => {
      state.totalWishlistCount = action.payload;
    },
    setOfferList: (state, action) => {
      state.offerList = action.payload;
    },
    setAddWishList: (state, action) => {
      state.addWishlist = action.payload;
    },
    setListWishList: (state, action) => {
      state.listWishlist = action.payload;
    },
    setUserReview: (state, action) => {
      state.userReview = action.payload;
    },
    setUserReviewCount: (state, action) => {
      state.userReviewCount = action.payload;
    },
    setReviewCount: (state, action) => {
      state.getReview = action.payload;
    },
    setGetAnReviewCount: (state, action) => {
      state.getReviewCount = action.payload;
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
  setSearch,
  setTotalResults,
  setTotalRecentViewResults,
  setTotalProductListCount,
  setTotalFilterList,
  setProductDetailResponse,
  setTotalAddressCount,
  setTotalWishlistCount,
  setOfferList,
  setAddWishList,
  setListWishList,
  setUserReview,
  setUserReviewCount,
  setReviewCount,
  setGetAnReviewCount,
} = cartSlice.actions;
export default cartSlice.reducer;
