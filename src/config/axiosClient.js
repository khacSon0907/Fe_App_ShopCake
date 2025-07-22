import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

  
    const publicPaths = ["/auth/login", "/auth/google", "/auth/register", "/auth/verify-otp"];

    const isPublic = publicPaths.some((path) => config.url.includes(path));

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("👉 Request headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      console.warn("Bạn chưa đăng nhập hoặc token đã hết hạn.");
      // Có thể redirect về trang login nếu cần
    }

    console.error("API Error:", response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
