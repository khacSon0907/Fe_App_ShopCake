import { Box, Container } from "@mui/material";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleCart = () => {
    navigate("/cart");
  };

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
        color: "text.secondary",
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
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
              onClick={handleCart}
            >
              <ShoppingCartIcon fontSize="large" />
            </Box>

            <UserMenu />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
