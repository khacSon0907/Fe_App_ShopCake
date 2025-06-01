import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", path: "/admin" },
  {
    label: "Quản lý sản phẩm",
    children: [
      { label: "Loại sản phẩm", path: "/admin/categories" },
      { label: "Sản phẩm", path: "/admin/products" },
    ],
  },
  {
    label: "Quản lý người dùng",
    children: [
      { label: "Tài khoản khách hàng", path: "/admin/users" },
      { label: " Khách hàng ", path: "/admin" },
    ],
  },
  { label: "Quản lý đơn hàng", path: "/"},
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const handleToggle = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

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
      <List sx={{ mt: 4 }}>
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openMenus[item.label] || false;
            return (
              <Box key={item.label}>
                <ListItemButton onClick={() => handleToggle(item.label)}>
                  <ListItemText primary={item.label} />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((subItem) => (
                      <ListItemButton
                        key={subItem.path}
                        sx={{
                          pl: 10,
                          pr: 2, // padding phải nhỏ lại
                          fontSize: "0.875rem", // thu nhỏ text
                          "& .MuiListItemText-primary": {
                            fontSize: "0.875rem", // text nhỏ hơn một chút
                          },
                        }}
                        onClick={() => navigate(subItem.path)}
                      >
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItemButton key={item.path} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
