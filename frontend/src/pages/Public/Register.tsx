import React, { useState } from 'react';
import { Container, Box, Card, CardContent, TextField, Button, Typography, Alert, MenuItem, Grid, InputAdornment } from '@mui/material';
import { School, Mail, Lock, Phone, AssignmentInd, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const currentYear = new Date().getFullYear();
const gradYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    branch: 'CSE',
    cgpa: '',
    graduationYear: currentYear + 2,
    skills: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, cgpa } = formData;

    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    const cgpaNum = parseFloat(cgpa);
    if (cgpa && (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10)) {
      setError('CGPA must be a valid number between 0.00 and 10.00.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/api/auth/register', {
        ...formData,
        cgpa: cgpa ? cgpaNum : null,
      });

      setSuccess('Profile registered successfully! Redirecting to login portal...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.details) {
        setError(err.response.data.details.join(', '));
      } else {
        setError('An error occurred during registration. Please try again.');
      }
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
        py: 6,
      }}
    >
      <Container maxWidth="md">
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
            Register your student account to apply for recruitment drives
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom mb={3}>
              Student Registration
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    required
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AssignmentInd color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    required
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    helperText="Minimum 6 characters"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Academic Branch"
                    name="branch"
                    fullWidth
                    value={formData.branch}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {branches.map((b) => (
                      <MenuItem key={b} value={b}>{b}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="CGPA (Out of 10.00)"
                    name="cgpa"
                    placeholder="e.g. 8.75"
                    fullWidth
                    value={formData.cgpa}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Graduation Year"
                    name="graduationYear"
                    fullWidth
                    value={formData.graduationYear}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {gradYears.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Skills Inventory"
                    name="skills"
                    placeholder="e.g. Java, Python, React, PostgreSQL (comma separated)"
                    fullWidth
                    value={formData.skills}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Star color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box mt={4} display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                  {loading ? 'Registering...' : 'Register Profile'}
                </Button>
                
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Already registered?{' '}
                    <Button 
                      variant="text" 
                      size="small" 
                      onClick={() => navigate('/login')}
                      sx={{ fontWeight: 'bold', p: 0, minWidth: 'auto' }}
                    >
                      Sign In here
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
