import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
  modalType: "",
  login: { userPhoneOrEmail: "", password: "" },
  signup: { userPhoneOrEmail: "", password: "" },
  otp: {
    otpCode: "",
  },
  forgotPassword: {
    newPassword: "",
    confirmPassword: "",
  },
  isCategoryModalOpen: false,
  selectedCategory: null,
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
    setOtp(state, action) {
      state.otp = { ...state.otp, ...action.payload };
    },
    setForgotPassword: (state, action) => {
      state.forgotPassword = {
        ...state.forgotPassword,
        ...action.payload,
      };
    },
    toggleCategoryModal: (state, action) => {
      state.isCategoryModalOpen = action.payload.isOpen;
      state.selectedCategory = action.payload.category || null;
    },
    // setIsCategoryModalOpen: (state, action) => {
    //   state.isCategoryModalOpen = action.payload;
    // },
  },
});

export const {
  toggleModal,
  setModalType,
  setLogin,
  setSignup,
  setOtp,
  setForgotPassword,
  toggleCategoryModal,
} = modalSlice.actions;
export default modalSlice.reducer;
