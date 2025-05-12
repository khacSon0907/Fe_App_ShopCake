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
              textDecoration: "none",
              color: "white",
              fontWeight: isActive ? 700 : 500,
              borderBottom: isActive ? "2px solid white" : "none",
              paddingBottom: 1,
              letterSpacing: "1px",
              fontSize: "14px",
              transition: "all 0.1s ease-in-out",
              "&:hover": {
                borderBottom: "2.5px solid white",
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
