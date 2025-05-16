import { Box } from "@mui/material";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export default function Header() {
  return (
    <Box
   sx={{
    position: "fixed",
    top: 0,
    height: "88px",
    width: "100%",
    backgroundColor: "primary.main",
    display: "flex",
    alignItems: "center",
    px: 10,
    justifyContent: "space-between",
    zIndex: 1200, // Lớn hơn MarqueeBar
    transition: "top 0.3s ease",
  }}
    >
      <Box sx={{display: "flex", alignItems: "center", gap: 6 }}>
        <Logo />
        <NavLinks />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ShoppingCartIcon fontSize="large"/>
        <UserMenu />
        <ThemeSwitcher />
      </Box>
    </Box>
  );
}
