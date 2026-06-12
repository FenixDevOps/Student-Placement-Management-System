import React from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Paper, Stack } from '@mui/material';
import { Login, School, Business, BarChart, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* Top Header */}
      <Paper elevation={1} square sx={{ py: 2, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" color="primary" fontWeight="bold">
              PlacementPortal
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Login />} 
              onClick={() => navigate('/login')}
              sx={{ fontWeight: 'bold' }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          background: (theme) => theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight={800} 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  letterSpacing: -1,
                  lineHeight: 1.1,
                }}
              >
                Connecting Talent with <span style={{ color: '#1976d2' }}>Opportunity</span>
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph sx={{ mt: 3, mb: 4, fontWeight: 500 }}>
                A centralized, unified university placement portal connecting top tier recruiters with engineering students.
                Track status updates, eligibility criteria, CTC details, and generate analytics report logs.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  endIcon={<ChevronRight />}
                  onClick={() => navigate('/login')}
                  sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                >
                  Student Portal
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={() => navigate('/login')}
                  sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                >
                  Admin Portal
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'background.paper', borderRadius: 4 }}>
                    <Typography variant="h3" color="primary" fontWeight={800}>92%</Typography>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mt={1}>Placement Rate</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'background.paper', borderRadius: 4 }}>
                    <Typography variant="h3" color="success.main" fontWeight={800}>32.5LPA</Typography>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mt={1}>Highest CTC Offer</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'background.paper', borderRadius: 4 }}>
                    <Typography variant="h3" color="warning.main" fontWeight={800}>50+</Typography>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mt={1}>Recruiter Partners</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'background.paper', borderRadius: 4 }}>
                    <Typography variant="h3" color="secondary.main" fontWeight={800}>15.6LPA</Typography>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mt={1}>Average Package</Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Info Sections */}
      <Box py={8} bgcolor="background.paper">
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom mb={6}>
            How PlacementPortal Empowers You
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ border: 'none', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <School color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    For Students
                  </Typography>
                  <Typography color="text.secondary">
                    Create profiles, upload PDF resumes, check CGPA eligibility thresholds, and apply to job roles with a single tap.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ border: 'none', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Business color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    For Recruiter Drives
                  </Typography>
                  <Typography color="text.secondary">
                    Register corporate slots, set CTC numbers, publish criteria bounds, and collect qualified student resume links.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ border: 'none', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <BarChart color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    For Administrators
                  </Typography>
                  <Typography color="text.secondary">
                    Review and shortlist profiles, update drive status stages, verify applicants, and export PDF placement logs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box bgcolor="grey.900" py={3} textAlign="center" color="white" mt="auto">
        <Container maxWidth="lg">
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Student Placement Management System. Built with Java Spring Boot, React, and Material UI.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
