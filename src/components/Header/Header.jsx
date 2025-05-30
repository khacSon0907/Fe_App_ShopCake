import { Box, Container } from "@mui/material";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Header() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "88px",
        backgroundColor: "primary.main",
        zIndex: 1200,
        transition: "top 0.3s ease",
        color:"text.secondary"
      }}
    >
      {/* ✅ Container giới hạn chiều ngang */}
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Logo />
            <NavLinks />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ShoppingCartIcon fontSize="large" />
            <UserMenu />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
