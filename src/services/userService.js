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
  return axiosClient.post(
    "/auth/google",
    { idToken },
    {
      headers: {
        "Content-Type": "application/json", // ✅ BẮT BUỘC để tránh lỗi 403
      },
    }
  );
};


// src/services/userService.js
export const getCurrentUser = () => {
  return axiosClient.get("/users/find-userId");
};

export const getAllUsers = () => {
  return axiosClient.get("/admin/users/read-users");
};


export const updateUserActive = (id, isActive) => {
  return axiosClient.put(`/admin/users/active/${id}`, {
    active: isActive,
  });
};


export const updateUser = async (data) => {
  const formData = new FormData();
  formData.append("request", JSON.stringify({
    fullname: data.fullname,
    phoneNumber: data.phoneNumber,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    avatarUrl: data.avatarUrl,
    address: data.address,
  }));
  if (data.avatarFile) {
    formData.append("avatarFile", data.avatarFile);
  }

return axiosClient.put("/users/update-user", formData, {
  headers: {
    "Content-Type": "multipart/form-data", // hoặc để undefined
  },
});
};

export const changePassword = (data) => {
  return axiosClient.put("/users/change-password", data);
};
