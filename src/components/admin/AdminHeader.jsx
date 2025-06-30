// src/components/Admin/AdminHeader.jsx
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Container,
  IconButton,
  Badge,
  Tooltip,
  alpha,
  useTheme
} from "@mui/material";
import { 
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Store as StoreIcon
} from "@mui/icons-material";
import UserMenu from "../Header/UserMenu";

export default function AdminHeader() {
  const theme = useTheme();
  
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: 1201,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha('#FFB74D', 0.1)} 0%, ${alpha('#FF8A65', 0.1)} 100%)`,
          zIndex: -1,
        }
      }}
    >
      <Container maxWidth="xl" sx={{ height: "100%" }}>
        <Toolbar 
          sx={{ 
            minHeight: { xs: 64, sm: 70 },
            px: { xs: 1, sm: 2 }
          }}
        >
          {/* Logo & Title Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              gap: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.2)} 0%, ${alpha(theme.palette.common.white, 0.1)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              }}
            >
              <StoreIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Admin Panel
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha(theme.palette.common.white, 0.8),
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  mt: -0.5
                }}
              >
                Cái Lò Nướng 🍰
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Dashboard" arrow>
              <IconButton
                size="medium"
                sx={{
                  color: alpha(theme.palette.common.white, 0.8),
                  '&:hover': {
                    color: 'white',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <DashboardIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications" arrow>
              <IconButton
                size="medium"
                sx={{
                  color: alpha(theme.palette.common.white, 0.8),
                  '&:hover': {
                    color: 'white',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings" arrow>
              <IconButton
                size="medium"
                sx={{
                  color: alpha(theme.palette.common.white, 0.8),
                  '&:hover': {
                    color: 'white',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Box sx={{ ml: 1 }}>
              <UserMenu />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}