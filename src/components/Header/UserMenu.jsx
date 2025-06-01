import { Avatar, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import noavatar from "../../assets/noavatar.jpg";

export default function UserMenu() {
  const user = useSelector((state) => state.user.data);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isLoggedIn = Boolean(localStorage.getItem("accessToken")) && user;

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleChangePassWord = () => {
    navigate("/change-password");
    handleClose();
  };

  const handleAdmin = () => {
    navigate("/admin");
    handleClose();
  };

  const handleHome = () => {
    navigate("/");
    handleClose();
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload(); // reload để Redux và layout làm sạch
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (!isLoggedIn) {
    return (
      <Button
        variant="outlined"
        color="inherit"
        size="large"
        onClick={handleLogin}
        sx={{ fontWeight: 700 }}
      >
        Đăng nhập
      </Button>
    );
  }

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar
          src={user?.avatarUrl || noavatar}
          sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
        />
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleProfile}>Hồ sơ</MenuItem>

        {user?.authProvider !== "GOOGLE" && (
          <MenuItem onClick={handleChangePassWord}>Đổi mật khẩu</MenuItem>
        )}

        {user?.role === "ADMIN" && (
          <MenuItem onClick={handleAdmin}>Quản trị</MenuItem>
        )}
        {user?.role === "ADMIN" && (
          <MenuItem onClick={handleHome}>Home</MenuItem>
        )}

        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </>
  );
}
