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
import { setAddAddress, setLogout, setUser } from "./userSlice";
import { getTokensFromLocalStorage, removeTokensFromLocalStorage, saveTokensToLocalStorage } from "../../utils/StorageTokens";
import { setCMSContentType } from "./cmsSlice";
import { setAllCategories, setAllCategoryList, setHomeProductData, setHomeProductSection, setRecentView, setSubCategoryList } from "./productSlice";

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
    // const tokens = {
    //   email: response?.email || "",
    //   phone: response?.phone || "",
    //   fullname: response?.first_name + " " + response?.last_name || "",
    //   profile_pic: response?.profile_pic || "",
    // };
    // dispatch(setAuthTokens(tokens));
  } catch (error) {
    dispatch(setLoading(false));
    // 401 - access token expired, call jwt token API again.
    const responseObj = {
      refresh_token: getTokensFromLocalStorage()?.accessToken,
      device_token: device_token
    }
    dispatch(generateExpiredToken(responseObj))
    // dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};

// Thunk to handle change user password API call
export const generateExpiredToken = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(JWT_TOKEN_CONSTANT, userData);
    
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
    dispatch(clearAuthTokens())
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
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
    const response = await GET(CMSP_PAGE_CONSTANT, {}, {url: getUrl});
    
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


// Thunk to handle get All Address List API call
export const getListAddress = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(LIST_ADDRESS_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setUser({addresses: response.data}));
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
export const getHomeSection = (offset = 0, limit = 10) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(HOME_SECTION_CONSTANT, null, {}, { offset, limit });
    
    dispatch(setLoading(false));
    dispatch(setHomeProductSection(response.productSections));
    
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

// Thunk to handle get recently viewed Data API call
export const getAllRecentViewData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await GET(RECENT_VIEW_CONSTANT);
    
    dispatch(setLoading(false));
    dispatch(setRecentView(response.data));
  } catch (error) {

    dispatch(setLoading(false));
    dispatch(setError(error.message));
    setTimeout(() => {
      dispatch(resetError());
    }, 1000);
  }
};