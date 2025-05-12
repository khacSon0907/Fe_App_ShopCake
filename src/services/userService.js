import axiosClient from "../config/axiosClient";

export const userService = {
  register(data) {
    return axiosClient.post("/auth/register", data);
  },

  getUserInfo() {
    return axiosClient.get("/user/profile");
  },
};
