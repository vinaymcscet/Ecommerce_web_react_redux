import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cmsContentType: null,
  cmsSocialLinks: null,
  cmsContactUs: null,
  cmsGroupItem: null,
  isManageCookiesModal: false,
};

export const cmsSlice = createSlice({
  name: "cms",
  initialState,
  reducers: {
    setCMSContentType: (state, action) => {
      state.cmsContentType = { ...state.cmsContentType, ...action.payload};
    },
    setCmsSocialLinks: (state, action) => {
      state.cmsSocialLinks = action.payload;
    },
    setCmsGroupItem: (state, action) => {
      state.cmsGroupItem = action.payload;
    },
    setManageCookiesModal: (state, action) => {
      state.isManageCookiesModal = action.payload.isOpen;
    }
  },
});

export const {
    setCMSContentType,
    setCmsSocialLinks,
    setCmsContactUs,
    setCmsGroupItem,
    setManageCookiesModal,
} = cmsSlice.actions;
export default cmsSlice.reducer;