import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Menu from "../pages/Menu/Menu";
import OtpResgister from "../pages/Register/OtpResgister";
import UserProfile from "../pages/UserProfile/UserProfile";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../layouts/AdminLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../services/userService";
import { setUser ,setLoading,clearUser} from "../store/userSlice";
import Dashboard from "../pages/admin/Dashboard";
import UserManage from "../pages/admin/UserManage";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import CategoryManage from "../pages/admin/CategoryManage";
import ProductManage from "../pages/admin/ProductManage";
import Cart from "../pages/cart/Cart";
import ProductDetail from "../components/Product/ProductDetail";
export default function AppRoutes() {
  const dispatch = useDispatch();

 useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    dispatch(setLoading(true)); // ✅ bắt đầu loading
    getCurrentUser()
      .then((res) => {
        dispatch(setUser(res.data));
      })
      .catch((err) => {
        dispatch(clearUser()); // fallback
        console.error("Không thể lấy thông tin người dùng:", err);
      });
  } else {
    dispatch(setLoading(false)); // không có token cũng kết thúc loading
  }
}, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Giao diện chính */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OtpResgister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
        </Route>

        {/* 🔸 Khu vực Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManage />} />
          <Route path="categories" element={<CategoryManage />} />
          <Route path="products" element={<ProductManage/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
