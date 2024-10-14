import { createSlice } from "@reduxjs/toolkit";
import { POST } from "../../utils/API";
import { SIGNUP_BASE_CONSTANT } from "../../utils/Constants";

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
  selectedAddress: null,
  error: "",
  loading: false,
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
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
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
  editAddress,
  setError,
  setLoading,
} = modalSlice.actions;
export default modalSlice.reducer;

// Thunk to handle signup API call
export const signupUser = (userData) => async (dispatch) => {
  console.log("signup userData on slice ", userData);
  try {
    dispatch(setLoading(true));
    // Call the API to sign up the user
    const response = await POST(SIGNUP_BASE_CONSTANT, userData); // Adjust your endpoint here
    dispatch(setLoading(false));
    console.log("response", response);
    

    // Handle success (e.g., move to the OTP step)
    dispatch(setModalType("otp"));
  } catch (error) {
    console.log("POST Signup Error", error);
    dispatch(setLoading(false));
    dispatch(setError("Failed to sign up. Please try again."));
  }
};
