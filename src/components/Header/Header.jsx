import { Box } from "@mui/material";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";

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
      <Logo />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <UserMenu />
        <ThemeSwitcher />
      </Box>
    </Box>
  );
}
