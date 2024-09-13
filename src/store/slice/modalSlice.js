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
  isAddressModelOpen: false,
  addresses: [],
  defaultAddressId: null,
  selectedAddress: null
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
  toggleAddressModal,
  saveAddress,
  removeAddress,
  setDefaultAddress,
  editAddress
} = modalSlice.actions;
export default modalSlice.reducer;
