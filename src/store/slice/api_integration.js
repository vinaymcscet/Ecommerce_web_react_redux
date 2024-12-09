import {
  LOGIN_USER_BASE_CONSTANT,
  REGISTER_USER_BASE_CONSTANT,
  REGISTER_USER_OTP_BASE_CONSTANT,
  FORGET_PASSWORD_OTP_REQUEST_CONSTANT,
  FORGET_PASSWORD_REQUEST_CONSTANT,
  FORGET_PASSWORD_CONFIRM_REQUEST_CONSTANT,
  LOGOUT_REQUEST_CONSTANT,
  GET_USER_PROFILE_CONSTANT,
  CHANGE_PASSWORD_CONSTANT,
  UPDATE_PROFILE_CONSTANT,
  CMSP_PAGE_CONSTANT,
  LIST_ADDRESS_CONSTANT,
  HOME_DATA_CONSTANT,
  HOME_SECTION_CONSTANT,
  JWT_TOKEN_CONSTANT,
  device_token,
  ALL_CATEGORIES_CONSTANT,
  SUB_CATEGORIES_CONSTANT,
  RECENT_VIEW_CONSTANT,
  PRODUCTS_CONSTANT,
  PRODUCTS_LIST_CONSTANT,
  SEARCH_PRODUCT_CONSTANT,
  ADD_ADDRESS_CONSTANT,
  EDIT_ADDRESS_CONSTANT,
  DELETE_ADDRESS_CONSTANT,
  DEFAULT_ADDRESS_CONSTANT,
  TOTAL_FILTER_CONSTANT,
  PRODUCT_DETAIL_CONSTANT,
  OFFER_LIST_CONSTANT,
  ADD_WHISTLIST_CONSTANT,
  LIST_WHISTLIST_CONSTANT,
  DELETE_WHISTLIST_CONSTANT,
  ADD_REVIEW_CONSTANT,
  GET_USER_REVIEW_CONSTANT,
  GET_REVIEW_CONSTANT,
  ADD_TO_CART_CONSTANT,
  GET_ITEMS_IN_CART_CONSTANT,
  VIEW_ITEMS_IN_CART_CONSTANT,
  DELETE_ITEMS_IN_CART_CONSTANT,
  CREATE_ORDER_CONSTANT,
  CONFIRM_ORDER_CONSTANT,
  GET_ALL_BLOGS_CONSTANT,
  GET_ALL_BLOGS_CATEGORY_CONSTANT,
  GET_BLOG_DETAIL_CONSTANT,
  ADD_BLOG_REVIEW_CONSTANT,
  GET_NOTIFICATIONS_CONSTANT,
  CLEAR_NOTIFICATIONS_CONSTANT,
  CMS_SOCIAL_LINK_CONSTANT,
  CMS_CONTACT_US_CONSTANT,
  ORDER_LIST_CONSTANT,
  PRODUCT_SECTION_CONSTANT,
  SIMILAR_PRODUCT_LIST_CONSTANT,
  ALL_OFFERS_CONSTANT,
  ORDER_DETAIL_CONSTANT,
  SUBSCRIBE_NEWS_LETTER_CONSTANT,
  CMS_GROUP_ITEM_CONSTANT,
  REASON_LIST_CONSTANT,
  SELECTED_REASON_PRODUCT_CONSTANT,
} from "../../utils/Constants";
import { GET, POST } from "../../utils/API";
import {
  clearAuthTokens,
  resetError,
  resetSuccess,
  setAuthTokens,
  setError,
  setForgotOtp,
  setForgotOtpKeyCodeValue,
  setForgotPassword,
  setForgotPasswordAssist,
  setLoading,
  setLogin,
  setModalType,
  setOtp,
  setSignup,
  setSuccess,
  toggleCategoryModal,
  toggleModal,
} from "./modalSlice";
import { setBlogCategoryList, setBlogDetailList, setBlogList, setBlogReviewList, setLogout, setNewsLetter, setNotificationsCount, setNotificationsList, setUser } from "./userSlice";
import { getTokensFromLocalStorage } from "../../utils/StorageTokens";
import { setCmsContactUs, setCMSContentType, setCmsGroupItem, setCmsSocialLinks } from "./cmsSlice";
import {
  setAddToCartStatusCount,
  setAddWishList,
  setAllCategoryList, 
  setAllOffersList, 
  setGetAnReviewCount, 
  setHomeProductData, 
  setHomeProductSection, 
  setListWishList, 
  setOfferList, 
  setProductDetailResponse, 
  setProductList, 
  setProductSectionCount, 
  setProductSectionData, 
  setRecentView, 
  setReviewCount, 
  setSearch, 
  setSimilarProductCount, 
  setSimilarProductListResponse, 
  setSubCategoryList, 
  setTotalAddressCount, 
  setTotalFilterList, 
  setTotalProductListCount, 
  setTotalRecentViewResults, 
  setTotalResults, 
  setTotalWishlistCount,
  setUserReview,
  setUserReviewCount
} from "./productSlice";
import { addToCart, clearCart, setActiveOrderListCountResponse, setCancelledOrderListCountResponse, setConfirmOrderResponse, setCreateOrderResponse, setDeliveredListCountResponse, setOrderDetailResponse, setOrderListResponse, setReasonListResponse, setReturnOrderListCountResponse, setSelectedReasonCancelProductResponse, setViewCartItems, setViewCartOnCoupen } from "./cartSlice";

// Thunk to handle signup API call without OTP
export const signupUser = (userData) => async (dispatch) => {
  let response;
  try {
    dispatch(setLoading(true));
    response = await POST(REGISTER_USER_OTP_BASE_CONSTANT, userData); // Adjust your endpoint here
    dispatch(setLoading(false));
    dispatch(setSuccess(response.message));
    dispatch(setModalType("otp"));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle signup API call withOTP
export const signupUserWithOtp = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(REGISTER_USER_BASE_CONSTANT, userData); // Adjust your endpoint here
    dispatch(setLoading(false));

    const tokens = {
      accessToken: response?.access_token || "",
      refreshToken: response?.refresh_token || "",
      email: response?.email || "",
      username: response.username || "",
      phone: response?.phone || "",
      fullname: response?.fullname || "",
      profile_pic: response?.profile_pic || "",
    };
    dispatch(setAuthTokens(tokens));
    const userDetail = {
      email: response?.email || "",
      fullname: response?.fullname || "",
      phone: response?.phone || "",
      profile_pic: response?.profile_pic || "",
      username: response?.username || "",
    };
    dispatch(setUser(userDetail));

    dispatch(setSuccess(response.message));
    dispatch(toggleModal(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
    dispatch(setSignup({ userPhoneOrEmail: "", password: "" }));
    dispatch(setOtp({ otpCode: "" }));
  } catch (error) {
    dispatch(setLoading(false));

    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error?.message || error));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Login API call
export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(LOGIN_USER_BASE_CONSTANT, userData); // Adjust your endpoint here
    dispatch(setLoading(false));
    
    const tokens = {
      accessToken: response?.access_token || "",
      refreshToken: response?.refresh_token || "",
      email: response?.email || "",
      username: response.username || "",
      phone: response?.phone || "",
      fullname: response?.fullname || "",
      profile_pic: response?.profile_pic || "",
    };
    dispatch(setAuthTokens(tokens));
    const userDetail = {
      email: response?.email || "",
      fullname: response?.fullname || "",
      phone: response?.phone || "",
      profile_pic: response?.profile_pic || "",
      username: response?.username || "",
    };
    dispatch(setUser(userDetail));

    dispatch(setSuccess(response.message));
    dispatch(toggleModal(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
    dispatch(setLogin({ userPhoneOrEmail: "", password: "" }));
  } catch (error) {
    dispatch(setLoading(false));

    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Forgot API call
export const forgetPasswordRequest = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(FORGET_PASSWORD_REQUEST_CONSTANT, userData); // Adjust your endpoint here
    
    dispatch(setLoading(false));

    dispatch(setSuccess(response.message));
    // dispatch(toggleModal(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
    // dispatch(setForgotPasswordAssist({ userPhoneOrEmail: "" }));
    dispatch(setModalType("forgotOtp"))
  } catch (error) {
    dispatch(setLoading(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Forgot API call
export const forgetPasswordOtpRequest = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(FORGET_PASSWORD_OTP_REQUEST_CONSTANT, userData); // Adjust your endpoint here
    
    dispatch(setLoading(false));

    dispatch(setSuccess(response.message));
    dispatch(setForgotOtpKeyCodeValue(response.otp_key))
    // dispatch(toggleModal(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
    // dispatch(setForgotPasswordAssist({ userPhoneOrEmail: "" }));
    dispatch(setModalType('forgot'))
  } catch (error) {
    dispatch(setLoading(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error.message || error.error));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Forgot API call
export const forgetPasswordConfirmRequest = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(FORGET_PASSWORD_CONFIRM_REQUEST_CONSTANT, userData); // Adjust your endpoint here
    
    dispatch(setLoading(false));

    dispatch(setSuccess(response.message));
    // dispatch(toggleModal(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
    dispatch(setForgotPasswordAssist({ userPhoneOrEmail: "" }));
    dispatch(dispatch(setForgotOtp({ otpCode: "" })));
    dispatch(setForgotPassword({ newPassword: "", confirmPassword: '' }));
    dispatch(setForgotOtpKeyCodeValue(""))
    dispatch(toggleModal(false))
  } catch (error) {
    dispatch(setLoading(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Logout API call
export const logoutRequest = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(LOGOUT_REQUEST_CONSTANT, userData); // Adjust your endpoint here
    
    dispatch(setLoading(false));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(setLogout());
      dispatch(resetSuccess());
    }, 1000);
    dispatch(clearAuthTokens())
  } catch (error) {
    dispatch(setLoading(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get user details API call
export const getUserRequest = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(GET_USER_PROFILE_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setUser(response));
    const storageTokens = getTokensFromLocalStorage();

    const tokenObject = {
      accessToken: storageTokens?.accessToken,
      refreshToken: storageTokens?.refreshToken,
      email: response?.email,
      username: storageTokens?.username,
      phone: response?.mobile,
      fullname: response?.first_name + " " + response?.last_name,
      profile_pic: response?.profile_pic,
  
    };
    localStorage.setItem("authTokens", JSON.stringify(tokenObject));
  } catch (error) {
    dispatch(setLoading(false));
    // 401 - access token expired, call jwt token API again.
    const responseObj = {
      refresh_token: getTokensFromLocalStorage()?.accessToken,
      device_token: device_token
    }
    dispatch(generateExpiredToken(responseObj))
    // dispatch(setError(error.message));
    // setTimeout(() => {
    //   dispatch(resetError());
    // }, 1000);
  }
};

// Thunk to handle change user password API call
export const generateExpiredToken = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(JWT_TOKEN_CONSTANT, userData);
    
    dispatch(setLoading(false));
    // dispatch(setSuccess(response.message));

    // setTimeout(() => {
    //   dispatch(resetSuccess());
    // }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    // setTimeout(() => {
    //   dispatch(resetSuccess());
    // }, 0);
    dispatch(clearAuthTokens())
    // dispatch(setError(error.message));
    // setTimeout(() => {
    //   dispatch(resetError());
    // }, 1000);
  }
};

// Thunk to handle change user password API call
export const changePasswordRequest = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(CHANGE_PASSWORD_CONSTANT, userData);
    dispatch(setLoading(false));
    dispatch(setSuccess(response.message));

    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Update profile API call
export const updateProfileRequest = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(UPDATE_PROFILE_CONSTANT, userData);
    dispatch(setLoading(false));
    dispatch(setSuccess(response.message));
    dispatch(setUser(response))
    setTimeout(() => {
      dispatch(resetSuccess());
      dispatch(setSuccess([]));
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get CMS API call
export const getCMSRequest = (getUrl) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(CMSP_PAGE_CONSTANT, null, {url: getUrl});
    
    dispatch(setLoading(false));
    dispatch(setCMSContentType(response));

  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get CMS Social Links API call
export const getCMSSocialLinksRequest = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(CMS_SOCIAL_LINK_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setCmsSocialLinks(response.data));

  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get Contact us Enquiry API call
export const getCMSContactUsRequest = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await POST(CMS_CONTACT_US_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setCmsContactUs(response.data));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get CMS group-item API call
export const getCMSGroupItemRequest = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await POST(CMS_GROUP_ITEM_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setCmsGroupItem(response));
  } catch (error) {

    dispatch(setLoading(false));
  }
};

// Thunk to handle get All Address List API call
export const getListAddress = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(LIST_ADDRESS_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setUser({addresses: response.data}));
    // dispatch(setSuccess(response.message));
    dispatch(setTotalAddressCount(response.totalCount));
    // setTimeout(() => {
    //   dispatch(resetSuccess());
    // }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    // dispatch(setError(error.message));
    // setTimeout(() => {
    //   dispatch(resetError());
    // }, 1000);
  }
};

// Thunk to handle add Address List API call
export const addListAddress = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(ADD_ADDRESS_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setUser({addresses: response.data}));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
      const responseObj = {
        offset: 0,
        limit: 5
      }
      dispatch(getListAddress(responseObj));
  } catch (error) {

    dispatch(setLoading(false));
    // dispatch(setError(error.message));
    // setTimeout(() => {
    //   dispatch(resetError());
    // }, 1000);
  }
};

// Thunk to handle update Address List API call
export const updateListAddress = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(EDIT_ADDRESS_CONSTANT, userData);
    
    dispatch(setLoading(false));
    // dispatch(setUser({addresses: response.data}));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
    const responseObj = {
      offset: 0,
      limit: 5
    }
    dispatch(getListAddress(responseObj));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle delete Address List API call
export const deleteListAddress = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(DELETE_ADDRESS_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
    const responseObj = {
      offset: 0,
      limit: 5
    }
    dispatch(getListAddress(responseObj));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle default Address List API call
export const defaultListAddress = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(DEFAULT_ADDRESS_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
    const responseObj = {
      offset: 0,
      limit: 5
    }
    dispatch(getListAddress(responseObj));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get Home Data API call
export const getHomeData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(HOME_DATA_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setHomeProductData(response.homePage));
    // dispatch(setSuccess(response.message));
    // setTimeout(() => {
    //   dispatch(resetSuccess());
    // }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get Home Section API call
export const getHomeSection = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(HOME_SECTION_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setHomeProductSection(response.data));
    
  } catch (error) {

    dispatch(setLoading(false));
    // dispatch(setError(error.message));
    // setTimeout(() => {
    //   dispatch(resetError());
    // }, 1000);
  }
};

// Thunk to handle get Product Section API call
export const getProductSection = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(PRODUCT_SECTION_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setProductSectionData(response.data));
    dispatch(setProductSectionCount(response.totalCount));
    
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get All Categories Data API call
export const getAllCategoryData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(ALL_CATEGORIES_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setAllCategoryList(response.data));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle get sub-category Data API call
export const getSubCategoryData = (userdata) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { category_id } = userdata;
    // Call the API to sign up the user
    const response = await POST(SUB_CATEGORIES_CONSTANT, null, {}, {category_id});
    
    dispatch(setLoading(false));
    dispatch(setSubCategoryList(response?.data?.subcategories));
    // dispatch(toggleCategoryModal({ isOpen: true, category: response.data.subcategories }));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle post recently viewed Data API call
export const getAllRecentViewData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(RECENT_VIEW_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setRecentView(response.data));
    dispatch(setTotalRecentViewResults(response.totalCount)); 
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle all offers List Data API call
export const getAllOffersData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(ALL_OFFERS_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setAllOffersList(response.data));
    dispatch(setProductSectionCount(response.totalCount)); 
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle post recently viewed Data API call
export const getProductOnSubCategory = (userdata) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(PRODUCTS_CONSTANT, userdata);
    
    dispatch(setLoading(false));
    dispatch(setProductList(response.data));
    dispatch(toggleCategoryModal(false));
    dispatch(setTotalProductListCount(response.totalCount));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    dispatch(toggleCategoryModal(false));
    dispatch(setProductList());
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle post recently viewed Data API call
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch(setProductList([]));
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(PRODUCTS_LIST_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setProductList(response.data));
    dispatch(toggleCategoryModal(false));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle search result Data API call
export const searchProductData = (userData) => async (dispatch) => {
  try {
    dispatch(setSearch([]));
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(SEARCH_PRODUCT_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setSearch(response.data));
    dispatch(setTotalResults(response.totalCount)); 
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle number of filters result Data API call
export const totalFilterData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(TOTAL_FILTER_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setTotalFilterList(response.data));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Product detail Data API call
export const productDetailData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(PRODUCT_DETAIL_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setProductDetailResponse(response));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Product similar producrs Data API call
export const similarProductData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(SIMILAR_PRODUCT_LIST_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setSimilarProductListResponse(response.data));
    dispatch(setSimilarProductCount(response.totalCount));
  } catch (error) {

    dispatch(setLoading(false));
    // dispatch(setError(error.message));
    // setTimeout(() => {
    //   dispatch(resetError());
    // }, 1000);
  }
};

// Thunk to handle Add Whistlist Product API call
export const addProductOnWhistList = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(ADD_WHISTLIST_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setAddWishList(response.data));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle List Whistlist Product API call
export const getListOfWhistListData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(LIST_WHISTLIST_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setListWishList(response.data));
    // dispatch(setSuccess(response.message));
    dispatch(setTotalWishlistCount(response.totalCount));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle delete one Whistlist Product API call
export const deleteSingleWhistListData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(DELETE_WHISTLIST_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(getListOfWhistListData());
    // dispatch(setSuccess(response.message));
    // setTimeout(() => {
    //   dispatch(resetSuccess());
    // }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle OfferList Data API call
export const getOfferList = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(OFFER_LIST_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setOfferList(response.data));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle add Review Product API call
export const addReviewProductData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(ADD_REVIEW_CONSTANT, userData);
    
    dispatch(setLoading(false));
    // dispatch(setListWishList(response.data));
    dispatch(setSuccess(response.message));
    // dispatch(setTotalWishlistCount(response.totalCount));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    // dispatch(setError(error.message));
    // setTimeout(() => {
    //   dispatch(resetError());
    // }, 1000);
  }
};

// Thunk to handle get user Review Product API call
export const getUserReviewProductData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(GET_USER_REVIEW_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setUserReview(response.data));
    dispatch(setSuccess(response.message));
    dispatch(setUserReviewCount(response.totalCount));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    // dispatch(setError(error.message));
    // setTimeout(() => {
    //   dispatch(resetError());
    // }, 1000);
  }
};

// Thunk to handle get Review Product API call
export const getReviewProductData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(GET_REVIEW_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setReviewCount(response.data));
    dispatch(setSuccess(response.message));
    dispatch(setGetAnReviewCount(response.totalCount));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Add to cart Product API call
export const addToCartData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(ADD_TO_CART_CONSTANT, userData);
    
    dispatch(setLoading(false));
    // dispatch(setAddToCart(response.data));
    dispatch(setSuccess(response.message));
    dispatch(setAddToCartStatusCount(response.status));
    dispatch(viewItemsInCartData());
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle total Items in cart API call
export const getItemsInCartData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(GET_ITEMS_IN_CART_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(addToCart(response.data));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle view Items in cart API call
export const viewItemsInCartData = (userData = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(VIEW_ITEMS_IN_CART_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setViewCartItems(response.data));
    // dispatch(setSuccess(response.message));
    // setTimeout(() => {
    //   dispatch(resetSuccess());
    // }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    // dispatch(setViewCartItems(null));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle delete Items in cart API call
export const deleteItemsInCartData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(DELETE_ITEMS_IN_CART_CONSTANT, userData);
    
    dispatch(setLoading(false));
    // dispatch(setViewCartItems(response.data));
    dispatch(setSuccess(response.message));
    dispatch(viewItemsInCartData());
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Create Order in Order API call
export const createOrderData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(CREATE_ORDER_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setCreateOrderResponse(response.data));
    dispatch(setSuccess(response.message));
    // dispatch(viewItemsInCartData());
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Confirm Order in order API call
export const confirmOrderData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(CONFIRM_ORDER_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setConfirmOrderResponse(response.data));
    dispatch(setSuccess(response.message));
    dispatch(viewItemsInCartData());
    dispatch(clearCart());
    // dispatch(viewItemsInCartData());
    setTimeout(() => {
      dispatch(resetSuccess());
      dispatch(clearCart());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Order List API call
export const OrderListData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(ORDER_LIST_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setOrderListResponse(response.data));
    if(userData.status == 1) dispatch(setActiveOrderListCountResponse(response.totalCount));
    if(userData.status == 3) dispatch(setCancelledOrderListCountResponse(response.totalCount));
    if(userData.status == 6) dispatch(setReturnOrderListCountResponse(response.totalCount));
    if(userData.status == 5) dispatch(setDeliveredListCountResponse(response.totalCount));
    
    dispatch(setSuccess(response.message));
    // dispatch(viewItemsInCartData());
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setOrderListResponse());
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Order Detail API call
export const OrderDetailData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(ORDER_DETAIL_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setOrderDetailResponse(response.data));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle Reason List(Cancel/Return) API call
export const ReasonListData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(REASON_LIST_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setReasonListResponse(response.data));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle selected Reason to Cancel/Return API call
export const selectedCancelProduct = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(SELECTED_REASON_PRODUCT_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setSelectedReasonCancelProductResponse(response.data));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to get All Blogs List API call
export const getAllBlogs = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(GET_ALL_BLOGS_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setBlogList(response.data));
    dispatch(setSuccess(response.message));
    // dispatch(viewItemsInCartData());
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to get All Blogs Category List API call
export const getAllBlogsCategory = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(GET_ALL_BLOGS_CATEGORY_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setBlogCategoryList(response.data));
    dispatch(setSuccess(response.message));
    // dispatch(viewItemsInCartData());
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to get Blog Detail API call
export const getBlogDetailData = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(GET_BLOG_DETAIL_CONSTANT, null, {blog_id: id});
    
    dispatch(setLoading(false));
    dispatch(setBlogDetailList(response.data));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
}

// Thunk to get Add Blog Review API call
export const addBlogReviewData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(ADD_BLOG_REVIEW_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setBlogReviewList(response.data));
    dispatch(setSuccess(response.message));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
}

// Thunk to get All Notifications API call
export const getNotificationsData = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(GET_NOTIFICATIONS_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setNotificationsList(response.data));
    dispatch(setNotificationsCount(response.totalCount))
    
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
}

// Thunk to get clear All Notifications API call
export const clearNotificationsData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(CLEAR_NOTIFICATIONS_CONSTANT);
    
    dispatch(setLoading(false));
    // dispatch(setNotificationsList(response.data));
    dispatch(getNotificationsData())
    
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
}

// Thunk to get subscribe newsletter API call
export const subscribeNewsLetter = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(SUBSCRIBE_NEWS_LETTER_CONSTANT, userData);
    
    dispatch(setLoading(false));
    dispatch(setNewsLetter(response.message));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setNewsLetter(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
}