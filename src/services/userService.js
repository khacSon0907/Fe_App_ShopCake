import axiosClient from "../config/axiosClient";

export const registerUser = (data) => {
  return axiosClient.post("/auth/register", data);
};

export const otpRegister = (data) => {
  return axiosClient.post("/auth/verify-otp",data)
}

export const loginUser = (data) => {
  return axiosClient.post("/auth/login", data);
};

export const loginWithGoogle = (idToken) => {
  return axiosClient.post("/auth/google", { idToken });
};

// src/services/userService.js
export const getCurrentUser = () => {
  return axiosClient.get("/users/find-userId");
};

export const updateUser = (data) => {
 return  axiosClient.put("/users/update-user", data)
};