// src/layouts/AdminLayout.jsx
import { Box } from "@mui/material";
import AdminSidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../services/userService";
import { setUser } from "../store/userSlice";

export default function AdminLayout() {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getCurrentUser()
        .then((res) => {
          dispatch(setUser(res.data));
          console.log("res", res);
          
        })
        .catch((err) => {
          console.error("Không thể lấy thông tin người dùng:", err);
        });
    }
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, ml: "240px" }}>
        <AdminHeader />
        <Box
          sx={{
            mt: "64px",
            p: 3,
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
