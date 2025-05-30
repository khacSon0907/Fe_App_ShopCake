// src/components/Banner/Banner.jsx
import { Box, Typography, Button } from "@mui/material";
import panner from "../../assets/panner.jpg";
export default function Banner() {
  return (
    <Box
      sx={{
        height: { xs: "300px", md: "500px" },
        width: "100%",
        backgroundImage: `url(${panner})`, // 🔁 chỉnh đúng path ảnh
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        px: { xs: 2, md: 10 },
        py: 4,
        color: "white",
      }}
    >
      <Button
        variant="contained"
        size="large"
        sx={{
          marginTop:"90px",
          backgroundColor: "#ff9800", // hoặc orange[500] nếu bạn import từ MUI
          color: "#fff",
          "&:hover": {
            backgroundColor: "#fb8c00",
          },
        }}
      >
        Đặt ngay
      </Button>
    </Box>
  );
}
