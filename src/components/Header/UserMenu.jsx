import { Avatar, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Giả định kiểm tra login qua localStorage token
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleClose();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (!isLoggedIn) {
    // 👉 Nếu chưa login, chỉ hiển thị nút Đăng nhập
    return (
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        onClick={handleLogin}

    
      >
        Đăng nhập
      </Button>
    );
  }

  // 👉 Nếu đã login, hiển thị Avatar + Menu
  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleClose}>Hồ sơ</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </>
  );
}
