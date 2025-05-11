import { Box, Toolbar } from "@mui/material";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <Box>
      <Header />
      <Toolbar /> {/* Để tránh bị AppBar che */}
      <Box sx={{ px: 3, py: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
