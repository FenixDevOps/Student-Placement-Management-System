import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Divider } from '@mui/material';
import { Dashboard, AccountCircle, Business, Assignment, BarChart, People, Assessment, CalendarMonth, Forum } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onDrawerToggle, drawerWidth }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      onDrawerToggle();
    }
  };

  const menuItems = React.useMemo(() => {
    if (!user) return [];
    if (user.role === 'ADMIN') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
        { text: 'Students', icon: <People />, path: '/admin/students' },
        { text: 'Companies', icon: <Business />, path: '/admin/companies' },
        { text: 'Applications', icon: <Assignment />, path: '/admin/applications' },
        { text: 'Interviews', icon: <CalendarMonth />, path: '/admin/interviews' },
        { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
      ];
    } else {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/student/dashboard' },
        { text: 'Profile', icon: <AccountCircle />, path: '/student/profile' },
        { text: 'Companies', icon: <Business />, path: '/student/companies' },
        { text: 'Applications', icon: <Assignment />, path: '/student/applications' },
        { text: 'Calendar', icon: <CalendarMonth />, path: '/student/calendar' },
        { text: 'Forum', icon: <Forum />, path: '/student/forum' },
      ];
    }
  }, [user]);

  const drawerContent = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isSelected}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? 'inherit' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isSelected ? 600 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
