import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Tabs, Tab, TextField, Button, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, School, AdminPanelSettings, Lock, Mail } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<number>(0); // 0 = Student, 1 = Admin
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError(null);
    setUsername('');
    setPassword('');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', {
        username,
        password,
      });

      const { token, id, username: email, name, role } = response.data;
      
      // Store in Context and local storage
      login(token, { id, username: email, name, role });

      // Redirect based on role
      const from = location.state?.from?.pathname;
      if (role === 'ADMIN') {
        navigate(from || '/admin/dashboard', { replace: true });
      } else {
        navigate(from || '/student/dashboard', { replace: true });
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: (theme) => theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center" mb={3}>
          <Typography 
            variant="h4" 
            fontWeight={800} 
            color="primary" 
            gutterBottom
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', letterSpacing: -0.5 }}
          >
            PlacementPortal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter credentials to manage your academic placements path
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
          >
            <Tab icon={<School />} label="Student Login" iconPosition="start" />
            <Tab icon={<AdminPanelSettings />} label="Admin Login" iconPosition="start" />
          </Tabs>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label={activeTab === 0 ? 'Student Email' : 'Admin Username'}
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                {activeTab === 0 && (
                  <Box textAlign="center" mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      New placement candidate?{' '}
                      <Button 
                        variant="text" 
                        size="small" 
                        onClick={() => navigate('/register')}
                        sx={{ fontWeight: 'bold', p: 0, minWidth: 'auto' }}
                      >
                        Register Profile
                      </Button>
                    </Typography>
                  </Box>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
