// src/components/Admin/AdminSidebar.jsx
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Sản phẩm", path: "/admin/products" },
  { label: "Người dùng", path: "/admin/users" },
  { label: "Order Đơn hàng", path: "/admin/users" },

];

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
    
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: "1px solid #e0e0e0",
        position: "fixed",
        top: 0,
        left: 0,
        pt: 8,
      }}
    >
      <List 
        sx={{
            marginTop:"40px"
        }}
      >
        {menuItems.map((item) => (
          <ListItemButton key={item.path} onClick={() => navigate(item.path)}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
