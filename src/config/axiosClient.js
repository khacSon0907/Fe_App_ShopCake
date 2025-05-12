
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.example.com", // ⚠️ Thay bằng URL thật của bạn
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor để xử lý trước request
axiosClient.interceptors.request.use(
  (config) => {
    // Nếu cần thêm token:
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi hoặc response chung
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API error:", error.response);
    throw error;
  }
);

export default axiosClient;
