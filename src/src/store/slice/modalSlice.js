import { createSlice } from "@reduxjs/toolkit";
import { getTokensFromLocalStorage, removeTokensFromLocalStorage, saveTokensToLocalStorage } from "../../utils/StorageTokens";

const initialState = {
  isModalOpen: false,
  modalType: "",
  login: { userPhoneOrEmail: "", password: "" },
  signup: { userPhoneOrEmail: "", password: "" },
  otp: { otpCode: "" },
  forgotOtp: { otpCode: "" },
  forgotOtpKeyCodeValue: "",
  forgotPassword: { newPassword: "", confirmPassword: "" },
  forgotPasswordAssist: { userPhoneOrEmail: "" },
  isCategoryModalOpen: false,
  category_id: false,
  selectedCategory: null,
  category_name: '',
  isAddressModelOpen: false,
  addresses: [],
  defaultAddressId: null,
  selectedAddress: null,
  error: "",
  success: "",
  loading: false,
  accessToken: null,
  refreshToken: null,
  email: null,
  username: null,
  phone: null,
  profile_pic: "",
  fullname: "",
  isAuthenticated: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setModalType: (state, action) => {
      state.modalType = action.payload;
    },
    setLogin(state, action) {
      state.login = { ...state.login, ...action.payload };
    },
    setSignup(state, action) {
      state.signup = { ...state.signup, ...action.payload };
    },
    resetSignup: (state) => {
      state.signup = { userPhoneOrEmail: '', password: '' };
    },
    resetLogin: (state) => {
      state.login = { email: '', password: '' };
    },
    setOtp(state, action) {
      state.otp = { ...state.otp, ...action.payload };
    },
    resetOtp: (state) => {
      state.otp = { otpCode: '' };
    },
    setForgotOtp(state, action) {
      state.forgotOtp = { ...state.forgotOtp, ...action.payload };
    },
    resetForgotOtp(state, action) {
      state.forgotOtp = { otpCode: '' };
    },
    setForgotOtpKeyCodeValue(state, action) {
      state.forgotOtpKeyCodeValue = action.payload;
    },
    setForgotPassword: (state, action) => {
      state.forgotPassword = {
        ...state.forgotPassword,
        ...action.payload,
      };
    },
    resetForgotPassword: (state, action) => {
      state.forgotPassword = { newPassword: "", confirmPassword: "" };
    },
    setForgotPasswordAssist: (state, action) => {
      state.forgotPasswordAssist = { ...state.forgotPasswordAssist, ...action.payload };
    },
    resetForgotPasswordAssist: (state, action) => {
      state.forgotPasswordAssist = { userPhoneOrEmail: '' };
    },
    toggleCategoryModal: (state, action) => {
      state.isCategoryModalOpen = action.payload.isOpen;
      state.selectedCategory = action.payload.category || null;
      state.category_name = action.payload.category_name;
      state.category_id = action.payload.category_id;
    },
    toggleAddressModal: (state, action) => {
      state.isAddressModelOpen = action.payload.isOpen;
      if (action.payload.address) {
        state.selectedAddress = action.payload.address;
      } else {
        state.selectedAddress = null;
      }
    },
    saveAddress: (state, action) => {
      const newAddress = { ...action.payload, id: Date.now() };
      state.addresses.push(newAddress);
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );
    },
    setDefaultAddress: (state, action) => {
      state.defaultAddressId = action.payload; // Set the ID of the default address
    },
    editAddress: (state, action) => {
      const { id, updatedData } = action.payload;
      state.addresses = state.addresses.map((address) =>
        address.id === id ? { ...address, ...updatedData } : address
      );
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    resetSuccess: (state) => {
      state.success = '';
    },
    resetError: (state) => {
      state.error = '';
    },
    setAuthTokens: (state, action) => {
      const { accessToken, refreshToken, email, username, phone, profile_pic, fullname } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.email = email;
      state.username = username;
      state.phone = phone;
      state.profile_pic = profile_pic;
      state.fullname = fullname;
      state.isAuthenticated = true;
      
      // Save to localStorage
      saveTokensToLocalStorage(action.payload);
    },
    loadTokensFromStorage: (state) => {
      const tokens = getTokensFromLocalStorage();
      if (tokens) {
        state.accessToken = tokens?.accessToken;
        state.refreshToken = tokens?.refreshToken;
        state.email = tokens?.email;
        state.username = tokens?.username;
        state.phone = tokens?.phone;
        state.profile_pic = tokens?.profile_pic;
        state.fullname = tokens?.fullname;
        state.isAuthenticated = true;
      }
    },
    clearAuthTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.email = null;
      state.username = null;
      state.phone = null;
      state.profile_pic = null;
      state.fullname = null;    
      state.isAuthenticated = false;

      // Remove from localStorage
      removeTokensFromLocalStorage();
    },
  },
});

export const {
  toggleModal,
  setModalType,
  setLogin,
  setSignup,
  resetSignup,
  resetLogin,
  setOtp,
  resetOtp,
  setForgotOtp,
  resetForgotOtp,
  setForgotOtpKeyCodeValue,
  setForgotPassword,
  resetForgotPassword,
  setForgotPasswordAssist,
  resetForgotPasswordAssist,
  toggleCategoryModal,
  toggleAddressModal,
  saveAddress,
  removeAddress,
  setDefaultAddress,
  editAddress,
  setError,
  setSuccess,
  setLoading,
  resetSuccess,
  resetError,
  setAuthTokens, 
  loadTokensFromStorage, 
  clearAuthTokens 
} = modalSlice.actions;
export default modalSlice.reducer;