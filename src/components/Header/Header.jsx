import { 
  Box, 
  Container, 
  IconButton, 
  Badge, 
  Tooltip,
  Paper,
  alpha,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import { 
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";
import { useSelector } from "react-redux";

export default function Header() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartItems] = useState(10); // Mock cart items count

  const favoriteItems = useSelector((state) => state.favorite);
  console.log("log", favoriteItems);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCart = () => {
    navigate("/cart");
  };

  const handleFavorites = () => {
    navigate("/favorites");
  };

  const handleSearch = () => {
    navigate("/search");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenuItems = [
    { text: 'Trang chủ', icon: <HomeIcon />, path: '/' },
    { text: 'Sản phẩm', icon: <StoreIcon />, path: '/products' },
    { text: 'Giới thiệu', icon: <InfoIcon />, path: '/about' },
    { text: 'Liên hệ', icon: <ContactIcon />, path: '/contact' },
  ];

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: { xs: "62px", sm: "88px" },
          background: scrolled 
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)} 0%, ${alpha(theme.palette.primary.dark, 0.95)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled 
            ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
            : `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
          zIndex: 1200,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          color: "text.secondary",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha('#FFB74D', 0.08)} 0%, ${alpha('#FF8A65', 0.08)} 100%)`,
            zIndex: -1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
              px: { xs: 1, sm: 2 }
            }}
          >
            {/* Left Section - Logo & Navigation */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 6 } }}>
              <Logo />
              
              {/* Desktop Navigation */}
              {!isMobile && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <NavLinks />
                </Box>
              )}
            </Box>

            {/* Right Section - Actions & User Menu */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
              {/* Search Button */}
              <Tooltip title="Tìm kiếm" arrow>
                <IconButton
                  onClick={handleSearch}
                  sx={{
                    color: alpha(theme.palette.common.white, 0.9),
                    '&:hover': {
                      color: 'white',
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      transform: 'translateY(-2px) scale(1.05)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '12px',
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              {/* Favorites Button */}
              <Tooltip title="Yêu thích" arrow>
                <IconButton
                  onClick={handleFavorites}
                  sx={{
                    color: alpha(theme.palette.common.white, 0.9),
                    '&:hover': {
                      color: 'white',
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      transform: 'translateY(-2px) scale(1.05)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '12px',
                  }}
                >
                  <Badge 
                    badgeContent={favoriteItems.length}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#FF6B6B',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }
                    }}
                  >
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Cart Button */}
              <Tooltip title="Giỏ hàng" arrow>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.15)} 0%, ${alpha(theme.palette.common.white, 0.05)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.25)} 0%, ${alpha(theme.palette.common.white, 0.15)} 100%)`,
                      transform: 'translateY(-2px) scale(1.05)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                  onClick={handleCart}
                >
                  <IconButton
                    size="large"
                    sx={{
                      color: 'white',
                      p: { xs: 1.5, sm: 2 },
                      '&:hover': {
                        backgroundColor: 'transparent',
                      }
                    }}
                  >
                    <Badge 
                      badgeContent={cartItems} 
                      color="warning"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#FFB74D',
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          minWidth: '20px',
                          height: '20px',
                        }
                      }}
                    >
                      <ShoppingCartIcon fontSize="medium" />
                    </Badge>
                  </IconButton>
                </Paper>
              </Tooltip>

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  onClick={toggleMobileMenu}
                  sx={{
                    color: alpha(theme.palette.common.white, 0.9),
                    '&:hover': {
                      color: 'white',
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                    borderRadius: '12px',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Desktop User Menu */}
              {!isMobile && (
                <Box sx={{ ml: 1 }}>
                  <UserMenu />
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo />
          <IconButton onClick={toggleMobileMenu} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.2) }} />
        
        <List sx={{ flex: 1 }}>
          {mobileMenuItems.map((item) => (
            <ListItem 
              key={item.text}
              button 
              onClick={() => {
                navigate(item.path);
                toggleMobileMenu();
              }}
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
                borderRadius: 2,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.2) }} />
        
        <Box sx={{ p: 2 }}>
          <UserMenu />
        </Box>
      </Drawer>
    </>
  );
}