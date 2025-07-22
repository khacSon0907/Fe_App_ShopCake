import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
  Divider,
  ListItemIcon,
  Paper,
  Badge,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Inventory,
  Category,
  People,
  PersonOutline,
  ShoppingCart,
  Cake,
  Store,
  Receipt,
  PendingActions,
  LocalShipping,
  CheckCircle,
  Cancel,
  Assignment,
  TrendingUp,
  Refresh,
  AttachMoney,
  AccessTime,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  { 
    label: "Dashboard", 
    path: "/admin", 
    icon: <Dashboard />,
    color: "#667eea"
  },
  {
    label: "Quản lý sản phẩm",
    icon: <Inventory />,
    color: "#ff6b35",
    children: [
      { 
        label: "Loại sản phẩm", 
        path: "/admin/categories", 
        icon: <Category />,
        color: "#f7931e"
      },
      { 
        label: "Sản phẩm", 
        path: "/admin/products", 
        icon: <Cake />,
        color: "#ff8a65"
      },
    ],
  },
  {
    label: "Quản lý người dùng",
    icon: <People />,
    color: "#26a69a",
    children: [
      { 
        label: "Tài khoản khách hàng", 
        path: "/admin/users", 
        icon: <PersonOutline />,
        color: "#4db6ac"
      },
      { 
        label: "Khách hàng", 
        path: "/admin/customers", 
        icon: <People />,
        color: "#80cbc4"
      },
    ],
  },
  { 
    label: "Quản lý đơn hàng", 
    icon: <ShoppingCart />,
    color: "#ab47bc",
    badge: 5, // Số đơn hàng mới
    children: [
      { 
        label: "Tất cả đơn hàng", 
        path: "/admin/orders", 
        icon: <Receipt />,
        color: "#ba68c8",
        badge: 15 // Tổng số đơn hàng cần xử lý
      },
      { 
        label: "Đơn hàng mới", 
        path: "/admin/orders/pending", 
        icon: <PendingActions />,
        color: "#ff9800",
        badge: 5 // Đơn hàng chờ xác nhận
      },
      { 
        label: "Đang xử lý", 
        path: "/admin/orders/processing", 
        icon: <Refresh />,
        color: "#2196f3",
        badge: 3 // Đơn hàng đang chuẩn bị
      },
      { 
        label: "Đang giao hàng", 
        path: "/admin/orders/shipping", 
        icon: <LocalShipping />,
        color: "#03a9f4",
        badge: 7 // Đơn hàng đang vận chuyển
      },
      { 
        label: "Hoàn thành", 
        path: "/admin/orders/completed", 
        icon: <CheckCircle />,
        color: "#4caf50"
      },
      { 
        label: "Đã hủy", 
        path: "/admin/orders/cancelled", 
        icon: <Cancel />,
        color: "#f44336"
      },
      { 
        label: "Hoàn trả/Đổi hàng", 
        path: "/admin/orders/returns", 
        icon: <Assignment />,
        color: "#ff5722",
        badge: 2 // Yêu cầu hoàn trả
      },
    ],
  },
  {
    label: "Báo cáo & Thống kê",
    icon: <TrendingUp />,
    color: "#e91e63",
    children: [
      { 
        label: "Báo cáo doanh thu", 
        path: "/admin/reports/revenue", 
        icon: <AttachMoney />,
        color: "#ec407a"
      },
      { 
        label: "Thống kê đơn hàng", 
        path: "/admin/reports/orders", 
        icon: <Assignment />,
        color: "#f06292"
      },
      { 
        label: "Báo cáo theo thời gian", 
        path: "/admin/reports/time", 
        icon: <AccessTime />,
        color: "#f48fb1"
      },
    ],
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const handleToggle = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  const renderBadge = (count, color) => {
    if (!count) return null;
    return (
      <Badge
        badgeContent={count}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: color,
            color: 'white',
            fontSize: '0.7rem',
            minWidth: '18px',
            height: '18px',
            borderRadius: '9px',
            fontWeight: 'bold',
            boxShadow: `0 2px 8px ${color}40`,
          }
        }}
      />
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        marginTop: "50px",
        marginRight: "30",
        width: 280,
        height: "100vh",
        background: 'linear-gradient(180deg, #fff 0%, #f8f9fa 100%)',
        borderRight: "none",
        position: "fixed",
        top: 0,
        left: 0,
        pt: 2,
        overflow: "auto", // Changed to auto for scrolling
        zIndex: 1200,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '10px',
          '&:hover': {
            background: '#a8a8a8',
          },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
          }}
        >
          <Store fontSize="large" />
        </Avatar>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
          }}
        >
          Sweet Bakery
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      {/* Menu Items */}
      <List sx={{ px: 2, pb: 10 }}> {/* Added padding bottom for footer */}
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openMenus[item.label] || false;
            const parentActive = isParentActive(item.children);
            
            return (
              <Box key={item.label} sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleToggle(item.label)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: parentActive ? `${item.color}15` : 'transparent',
                    border: parentActive ? `1px solid ${item.color}30` : '1px solid transparent',
                    '&:hover': {
                      bgcolor: `${item.color}10`,
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: parentActive ? item.color : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: parentActive ? 600 : 500,
                      color: parentActive ? item.color : 'text.primary',
                      fontSize: '0.95rem',
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.badge && renderBadge(item.badge, item.color)}
                    {isOpen ? (
                      <ExpandLess sx={{ color: item.color }} />
                    ) : (
                      <ExpandMore sx={{ color: 'text.secondary' }} />
                    )}
                  </Box>
                </ListItemButton>
                
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ ml: 1 }}>
                    {item.children.map((subItem) => {
                      const subActive = isActive(subItem.path);
                      return (
                        <ListItemButton
                          key={subItem.path}
                          onClick={() => navigate(subItem.path)}
                          sx={{
                            pl: 6,
                            pr: 2,
                            py: 1,
                            borderRadius: 2,
                            mb: 0.5,
                            bgcolor: subActive ? `${subItem.color}20` : 'transparent',
                            border: subActive ? `1px solid ${subItem.color}` : '1px solid transparent',
                            '&:hover': {
                              bgcolor: `${subItem.color}15`,
                              transform: 'translateX(8px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: subActive ? subItem.color : 'text.secondary',
                              minWidth: 32,
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.label}
                            primaryTypographyProps={{
                              fontSize: '0.875rem',
                              fontWeight: subActive ? 600 : 500,
                              color: subActive ? subItem.color : 'text.primary',
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {subItem.badge && renderBadge(subItem.badge, subItem.color)}
                            {subActive && (
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  bgcolor: subItem.color,
                                  boxShadow: `0 0 10px ${subItem.color}50`,
                                }}
                              />
                            )}
                          </Box>
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: active ? `${item.color}20` : 'transparent',
                border: active ? `1px solid ${item.color}` : '1px solid transparent',
                '&:hover': {
                  bgcolor: `${item.color}15`,
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? item.color : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: active ? 600 : 500,
                  color: active ? item.color : 'text.primary',
                  fontSize: '0.95rem',
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.badge && renderBadge(item.badge, item.color)}
                {active && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: item.color,
                      boxShadow: `0 0 15px ${item.color}60`,
                    }}
                  />
                )}
              </Box>
            </ListItemButton>
          );
        })}
      </List>

    </Paper>
  );
}