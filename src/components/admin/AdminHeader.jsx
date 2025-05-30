// src/components/Admin/AdminHeader.jsx
import { AppBar, Box, Toolbar, Typography, Container } from "@mui/material";
import UserMenu from "../Header/UserMenu";
export default function AdminHeader() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: 1201, bgcolor: "primary.secondary" }}
    >
      <Container maxWidth="" sx={{ height: "100%" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Panel - Cái Lò Nướng 🍰
          </Typography>
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
