import { Box, Toolbar } from "@mui/material";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // 👈 Chiều cao toàn màn hình
      }}
    >
      <Header />

      <Box sx={{ flex: 1, px: 3, py: 2 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
