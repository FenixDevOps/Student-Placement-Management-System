import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Toolbar, Snackbar, Alert } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Client } from '@stomp/stompjs';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  
  // Real-time Notification States
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!user || user.role !== 'STUDENT') return;

    const brokerURL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8081/ws';
    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('STOMP WebSocket Connection Established.');
        // Subscribe to student specific status updates
        client.subscribe(`/topic/notifications/student/${user.id}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            setToastMessage(data.message || `Your application to ${data.companyName} has been updated to ${data.newStatus}`);
            setToastOpen(true);
          } catch (err) {
            console.error('Failed to parse websocket notification', err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [user]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* Spacer below navbar */}
        <Outlet />   {/* Sub route children page views */}
      </Box>

      {/* Real-time Status Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity="info" 
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 'bold' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;
