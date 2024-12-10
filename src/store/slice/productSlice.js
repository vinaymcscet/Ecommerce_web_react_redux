import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productHistory: [],
  productList: [],
  categorySlide: [],
  allCategories: [],
  homeProductData: null,
  homeProductSection: null,
  productSectionData: [],
  productSectionCount: 0,
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
  similarProductListResponse: null,
  similarProductCount: 0,
  offerList: null,
  addWishlist: null,
  listWishlist: null,
  userReview: null,
  userReviewCount: 0,
  getReview: null,
  getReviewCount: 0,
  getReviewImage: null,
  allOffersList: null,
  addToCartStatusCount: null,
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
      state.homeProductData = action.payload;
    },
    setProductSectionCount: (state, action) => {
      state.productSectionCount = action.payload;
    },
    setAllCategoryList: (state, action) => {
      const product = action.payload;
      state.allCategoryList.push(product);
    },
    setSubCategoryList: (state, action) => {
      state.subCategoryList = action.payload;
    },
    setHomeProductSection: (state, action) => {
      state.homeProductSection = action.payload;
    },
    setProductSectionData: (state, action) => {
      state.productSectionData = action.payload;
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
    setSimilarProductListResponse: (state, action) => {
      state.similarProductListResponse = action.payload;
    },
    setSimilarProductCount: (state, action) => {
      state.similarProductCount = action.payload;
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
    setGetAnReviewImage: (state, action) => {
      state.getReviewImage = action.payload;
    },
    setAllOffersList: (state, action) => {
      state.allOffersList = action.payload;
    },
    setAddToCartStatusCount: (state, action) => {
      state.addToCartStatusCount = action.payload;
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
  setProductSectionData,
  setAllCategoryList,
  setSubCategoryList,
  setRecentView,
  setSearch,
  setTotalResults,
  setTotalRecentViewResults,
  setTotalProductListCount,
  setTotalFilterList,
  setProductDetailResponse,
  setSimilarProductListResponse,
  setSimilarProductCount,
  setTotalAddressCount,
  setTotalWishlistCount,
  setOfferList,
  setAddWishList,
  setListWishList,
  setUserReview,
  setUserReviewCount,
  setReviewCount,
  setGetAnReviewCount,
  setGetAnReviewImage,
  setProductSectionCount,
  setAllOffersList,
  setAddToCartStatusCount,
} = cartSlice.actions;
export default cartSlice.reducer;
