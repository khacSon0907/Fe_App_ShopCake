import { Box } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import navItems from "./navItems";

export default function NavLinks() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", gap: 4 }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Box
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              color: "text.secondary",
              textDecoration: "none",
              fontWeight: isActive ? 700 : 500,
              borderBottom: isActive ? "2px solid currentColor" : "none", // 👈 dùng currentColor
              paddingBottom: 1,
              letterSpacing: "1px",
              fontSize: "16px",
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                borderBottom: "2.1px solid currentColor", // 👈 dùng màu chữ hiện tại
                opacity: 0.8,
              },
            }}
          >
            {item.label}
          </Box>
        );
      })}
    </Box>
  );
}
