import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: []
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
      console.log("userdetails", userdetails);
    },
    setLogout: (state) => {
      state.user = []
    }
    
  },
});

export const { setUser, setLogout } = userSlice.actions;
export default userSlice.reducer;
