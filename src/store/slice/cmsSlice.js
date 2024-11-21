import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cmsContentType: null,
  cmsSocialLinks: null,
  cmsContactUs: null,
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
    setCmsContactUs: (state, action) => {
      state.cmsContactUs = action.payload;
    },
  },
});

export const {
    setCMSContentType,
    setCmsSocialLinks,
    setCmsContactUs,
} = cmsSlice.actions;
export default cmsSlice.reducer;