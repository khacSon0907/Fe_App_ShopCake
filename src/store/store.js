// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import favoriteReducer from './favoriteSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    favorite: favoriteReducer,
  },
});

export default store;
