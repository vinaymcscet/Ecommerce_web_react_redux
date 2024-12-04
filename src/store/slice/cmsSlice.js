import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cmsContentType: null,
  cmsSocialLinks: null,
  cmsContactUs: null,
  cmsGroupItem: null,
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
     
  },
});

export const {
    setCMSContentType,
    setCmsSocialLinks,
    setCmsContactUs,
    setCmsGroupItem,
} = cmsSlice.actions;
export default cmsSlice.reducer;