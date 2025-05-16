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