import {
  LOGIN_USER_BASE_CONSTANT,
  REGISTER_USER_BASE_CONSTANT,
  REGISTER_USER_OTP_BASE_CONSTANT,
} from "../../utils/Constants";
import { POST } from "../../utils/API";
import {
  resetError,
  resetSuccess,
  setAuthTokens,
  setError,
  setLoading,
  setLogin,
  setModalType,
  setOtp,
  setSignup,
  setSuccess,
  toggleModal,
} from "./modalSlice";
import { setUser } from "./userSlice";

// Thunk to handle signup API call without OTP
export const signupUser = (userData) => async (dispatch) => {
  let response;
  try {
    dispatch(setLoading(true));
    response = await POST(REGISTER_USER_OTP_BASE_CONSTANT, userData); // Adjust your endpoint here
    console.log("first success API response", response);
    dispatch(setLoading(false));
    dispatch(setSuccess(response.message));
    dispatch(setModalType("otp"));
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 1000);
  } catch (error) {
    console.log(error.message);
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
    console.log("complete success API response", response.message);

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
    console.log("error", error);

    console.log("complete error API response", error.message);
    setTimeout(() => {
      dispatch(resetSuccess());
    }, 0);
    dispatch(setError(error.message));
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
