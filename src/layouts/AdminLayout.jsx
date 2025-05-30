// src/layouts/AdminLayout.jsx
import { Box } from "@mui/material";
import AdminSidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, ml: "240px" }}>
        <AdminHeader />
        <Box
          sx={{
            mt: "64px", // ✅ Chừa khoảng cho AppBar
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
