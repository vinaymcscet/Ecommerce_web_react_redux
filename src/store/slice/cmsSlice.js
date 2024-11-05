import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cmsContentType: null,
};

export const cmsSlice = createSlice({
  name: "cms",
  initialState,
  reducers: {
    setCMSContentType: (state, action) => {
      state.cmsContentType = { ...state.cmsContentType, ...action.payload};
    },
  },
});

export const {
    setCMSContentType,
} = cmsSlice.actions;
export default cmsSlice.reducer;