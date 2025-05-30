// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
  token: localStorage.getItem("accessToken") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    clearUser(state) {
      state.data = null;
    },
  },
});

export const { setUser, clearUser,setToken } = userSlice.actions;
export default userSlice.reducer;
