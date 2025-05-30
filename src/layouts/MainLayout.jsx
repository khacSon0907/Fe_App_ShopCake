import { Box } from "@mui/material";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";


export default function MainLayout() {


  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box sx={{ mt: "70px", flex: 1, py: 2 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
