import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
  changePassword: { oldPassword: "", newPassword: "", confirmPassword: "" },
  blogList: null,
  blogCategoryList: null,
  blogDetail: null,
  blogReview: null,
  notifications: null,
  notificationCount: 0,
  newsletter: null,
  cookiesInfo: null,
  cookiesStatus: null,
  defaultUserAddress: null,
  userAddress: null,
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
    setBlogList: (state, action) => {
      state.blogList = action.payload;
    },
    setBlogCategoryList: (state, action) => {
      state.blogCategoryList = action.payload;
    },
    setBlogDetailList: (state, action) => {
      state.blogDetail = action.payload;
    },
    setBlogReviewList: (state, action) => {
      state.blogReview = action.payload;
    },
    setNotificationsList: (state, action) => {
      state.notifications = action.payload;
    },
    setNotificationsCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    setNewsLetter: (state, action) => {
      state.newsletter = action.payload;
    },
    setClearNewsletterMessage: (state) => {
      state.newsletter = null;
    },
    setCookiesInfo: (state, action) => {
      state.cookiesInfo = action.payload;
    },
    setCookiesStatus: (state, action) => {
      state.cookiesStatus = action.payload;
    },
    setDefaultUserAddress: (state, action) => {
      state.defaultUserAddress = action.payload;
    },
    setUserAddress: (state, action) => {
      state.userAddress = action.payload;
    },
  },
});

export const { 
  setUser, 
  setLogout, 
  removeAddress, 
  setDefaultAddress, 
  setChangePassword, 
  setBlogList,
  setBlogCategoryList,
  setBlogDetailList,
  setBlogReviewList,
  setNotificationsList,
  setNotificationsCount,
  setNewsLetter,
  setClearNewsletterMessage,
  setCookiesInfo,
  setCookiesStatus,
  setDefaultUserAddress,
  setUserAddress,
 } =
  userSlice.actions;
export default userSlice.reducer;
