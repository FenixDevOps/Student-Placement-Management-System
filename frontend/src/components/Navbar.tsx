import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, Tooltip, Chip } from '@mui/material';
import { Menu as MenuIcon, DarkMode, LightMode, AccountCircle, ExitToApp } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: mode === 'light' ? 'primary.main' : 'background.paper' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          PlacementPortal
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <Chip 
              label={user.role} 
              color={user.role === 'ADMIN' ? 'error' : 'success'} 
              size="small" 
              sx={{ fontWeight: 'bold' }}
            />
          )}

          <Tooltip title="Toggle light/dark theme">
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {user && (
            <Box>
              <Tooltip title="Account profile settings">
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box px={2} py={1} sx={{ minWidth: 150 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.username}
                  </Typography>
                </Box>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', gap: 1 }}>
                  <ExitToApp size={18} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
