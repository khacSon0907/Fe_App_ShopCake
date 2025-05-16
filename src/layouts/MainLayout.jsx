import { Box, Toolbar } from "@mui/material";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

export default function MainLayout() {
  return (
    <Box
      sx={{
        bgcolor: "background.paper", // nền trắng hoặc đen tùy chế độ
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // 👈 Chiều cao toàn màn hình
      }}
    >
     
      <Header/>
      <Box sx={{mt:"70px", flex: 1, py: 2 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
