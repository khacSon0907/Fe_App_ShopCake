// src/layouts/AdminLayout.jsx
import { Box, Paper, Container } from "@mui/material";
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
    <Box 
      sx={{ 
        display: "flex",
        minHeight: "100vh",
        background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8e0 100%)',
      }}
    >
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <Box 
        sx={{ 
          flex: 1, 
          ml: "280px", // Match sidebar width
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <AdminHeader />
        
        {/* Content Container */}
        <Box
          component="main"
          sx={{
            flex: 1,
            mt: "80px", // Account for header height
            position: "relative",
            overflow: "auto",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
              pointerEvents: "none",
            }}
          />
          
          {/* Page Content */}
          <Container 
            maxWidth={false}
            sx={{ 
              px: 4,
              py: 3,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                minHeight: "calc(100vh - 140px)",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Outlet />
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}