// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: true, // ✅ ban đầu là true (đang check user)
  error: null,
  token: localStorage.getItem("accessToken") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
      state.loading = false; // ✅ set về false sau khi load xong
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    clearUser(state) {
      state.data = null;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});
export const { setUser, clearUser,setToken,setLoading } = userSlice.actions;
export default userSlice.reducer;
