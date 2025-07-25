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

export const changePassword = (data) => {
  return axiosClient.put("/users/change-password", data);
};

export const createCategory = (data) => {
  return axiosClient.post("/categories/create" ,(data))
}

export const getAllCategories = () =>{
  return axiosClient.get("/categories/getAll")
}

export const deleteCategory = (id) =>{
  return axiosClient.delete(`/categories/delete/${id}`)
}

export const updateCategory = (data) => {
  return axiosClient.put("/categories/update", data);
}

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

export const createProduct = (formData) => {
  return axiosClient.post("/admin/products/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
  export const getAllProducts=  () => {
    return axiosClient.get("/admin/products");
  }

export const deleteProductById = (id) =>{
  return axiosClient.delete(`/admin/products/${id}`)
}

export const updateProduct = (formData) => {
  return axiosClient.put("/admin/products/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getProductUser = () =>{
  return axiosClient.get("/products")
}

export const addTocart = (cartItem,userId) =>{
  return axiosClient.post(`/cart/add/${userId}`,cartItem)
}

export const getCartUser = (userId) =>{
    return axiosClient.get(`/cart/${userId}`)
}

export const getProductById = (id) =>{  
  return axiosClient.get(`/products/${id}`)
}

export const deleteCartItem = (userId,productId)=>{
  return axiosClient.delete(`/cart/${userId}/item/${productId}`)
}


export const createOrder = (orders) =>{
  return axiosClient.post("orders/create-order",orders)
}


export const getOrderbyUserId = (userId) => {
  return axiosClient.get(`orders/${userId}`)
}

export const getFavoritesByUserId = (userId) => {
  return axiosClient.get(`/favorites/${userId}`)
}


export const addToFavorite = (userId,data) => {
  return axiosClient.post(`/favorites/${userId}`,data)
}

export const removeFromFavorite = (userId,productId) =>{
  return axiosClient.delete(`/favorites/${userId}/${productId}`)
}

export const getAllOrders = () => {
  return axiosClient.get("/admin/orders/all")
}

export const updateOrderStatus = (orderId, newStatus) => {
  return axiosClient.put(`/admin/orders/${orderId}/update-status`, null, {
    params: {
      newStatus: newStatus,
    },
  });
};
