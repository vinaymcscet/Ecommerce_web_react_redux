import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
  changePassword: { oldPassword: "", newPassword: "", confirmPassword: "" },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userdetails = action.payload;
      if (state.user.length > 0) {
        // Merge the existing user data with the new data
        state.user[0] = { ...state.user[0], ...userdetails };
      } else {
        // If no user exists, add the new data as a fresh entry
        state.user.push(userdetails);
      }
    },
    setLogout: (state) => {
      state.user = [];
    },
    removeAddress: (state, action) => {
      state.user = state.user.map((user) => ({
        ...user,
        addresses: user.addresses.filter(
          (address) => address.id !== action.payload
        ),
      }));
    },
    setDefaultAddress: (state, action) => {
      state.user = state.user.map((user) => ({
        ...user,
        addresses: user.addresses.map((address) => ({
          ...address,
          isDefault: address.id === action.payload ? true : false,
        })),
      }));
    },
    setChangePassword: (state, action) => {
      state.changePassword = {
        ...state.changePassword,
        ...action.payload,
      };
    },
  },
});

export const { setUser, setLogout, removeAddress, setDefaultAddress, setChangePassword } =
  userSlice.actions;
export default userSlice.reducer;
