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
        height: "88px",
        width: "100%",
        backgroundColor: "primary.main",
        display: "flex",
        alignItems: "center",
        px: 10, // padding left + right
        justifyContent: "space-between",
        minHeight: "72px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Logo />
        <NavLinks />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ShoppingCartIcon fontSize="large" sx={{ color:"white"}}/>
        <UserMenu />
        <ThemeSwitcher />
      </Box>
    </Box>
  );
}
