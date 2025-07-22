import { 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Button, 
  Divider, 
  Typography, 
  Box,
  Chip
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  ShoppingBag as OrderIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon
} from "@mui/icons-material";
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
  const handleOrder = () => {
    navigate("/order");
    handleClose();
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (!isLoggedIn) {
    return (
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleLogin}
        startIcon={<LoginIcon />}
        sx={{ 
          fontWeight: 600,
          borderRadius: 2,
          textTransform: 'none',
          px: 3,
          py: 1,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)'
          },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Đăng nhập
      </Button>
    );
  }

  return (
    <>
      <IconButton 
        onClick={handleOpen}
        sx={{
          padding: 0.5,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Avatar
          src={user?.avatarUrl || noavatar}
          sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: "primary.main",
            border: '2px solid transparent',
            '&:hover': {
              border: '2px solid',
              borderColor: 'primary.main'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        />
      </IconButton>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.08)'
          }
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
           
            <Box>
            
              {user?.role === "ADMIN" && (
                <Chip 
                  label="Admin" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem 
          onClick={handleProfile}
          sx={{ 
            py: 1.5,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}
        >
          <PersonIcon sx={{ mr: 2, color: '#1976d2' }} />
          Hồ sơ
        </MenuItem>

        {user?.authProvider !== "GOOGLE" && (
          <MenuItem 
            onClick={handleChangePassWord}
            sx={{ 
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <LockIcon sx={{ mr: 2, color: '#ff9800' }} />
            Đổi mật khẩu
          </MenuItem>
        )}

        <MenuItem 
          sx={{ 
            py: 1.5,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}
         onClick={handleOrder}
         >
          <OrderIcon sx={{ mr: 2, color: '#4caf50' }} />
          Đơn hàng
        </MenuItem>

        {user?.role === "ADMIN" && (
          <>
            <Divider sx={{ my: 1 }} />
            <MenuItem 
              onClick={handleAdmin}
              sx={{ 
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <AdminIcon sx={{ mr: 2, color: '#9c27b0' }} />
              Quản trị
            </MenuItem>
            <MenuItem 
              onClick={handleHome}
              sx={{ 
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <HomeIcon sx={{ mr: 2, color: '#2196f3' }} />
              Home
            </MenuItem>
          </>
        )}

        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            py: 1.5,
            color: 'error.main',
            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' }
          }}
        >
          <LogoutIcon sx={{ mr: 2, color: '#f44336' }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
}