import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, InputAdornment, Chip, Alert, CircularProgress, Tooltip, Divider } from '@mui/material';
import { Search, CalendarToday, AttachMoney, AssignmentTurnedIn, Block, WarningAmber } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Company {
  companyId: number;
  companyName: string;
  role: string;
  packageAmount: number;
  eligibilityCriteria: number;
  description: string;
  lastDate: string;
}

interface Application {
  companyId: number;
  status: string;
}

interface StudentProfile {
  cgpa: number | null;
  resumeUrl: string | null;
}

const StudentCompanies: React.FC = () => {
  const { user } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({ cgpa: null, resumeUrl: null });
  const [appliedCompanyIds, setAppliedCompanyIds] = useState<Set<number>>(new Set());
  
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCompanyData = async (searchVal = '') => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch student details (for CGPA eligibility and resume presence checks)
      const studentRes = await api.get(`/api/students/${user.id}`);
      setStudentProfile({
        cgpa: studentRes.data.cgpa,
        resumeUrl: studentRes.data.resumeUrl,
      });

      // 2. Fetch companies list
      const companiesRes = await api.get(`/api/companies?search=${searchVal}&size=100`);
      setCompanies(companiesRes.data.content);

      // 3. Fetch student applications to identify already applied companies
      const appsRes = await api.get(`/api/applications/student/${user.id}?size=100`);
      const appliedIds = new Set<number>(
        appsRes.data.content.map((app: any) => app.companyId)
      );
      setAppliedCompanyIds(appliedIds);

    } catch (err: any) {
      setError('Failed to load companies listing details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [user]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanyData(search);
  };

  const handleApply = async (companyId: number) => {
    if (!user) return;
    
    setApplyingId(companyId);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/api/applications', {
        studentId: user.id,
        companyId: companyId,
      });

      setSuccess('Applied successfully! Check your email and dashboard timeline updates.');
      setAppliedCompanyIds((prev) => {
        const next = new Set(prev);
        next.add(companyId);
        return next;
      });
      
      // Auto-hide success message
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit job application. Please check eligibility requirements.');
      }
    } finally {
      setApplyingId(null);
    }
  };

  const isDeadlinePassed = (dateStr: string) => {
    const deadline = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  if (loading && companies.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4} display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Job Opportunities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse available recruiting companies, review criteria, and submit applications.
          </Typography>
        </Box>
        
        {studentProfile.cgpa !== null && (
          <Box display="flex" gap={1.5} alignItems="center">
            <Chip label={`My CGPA: ${studentProfile.cgpa}`} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
            <Chip 
              label={studentProfile.resumeUrl ? 'Resume Active' : 'Resume Required'} 
              color={studentProfile.resumeUrl ? 'success' : 'warning'} 
              variant="outlined" 
              sx={{ fontWeight: 'bold' }} 
            />
          </Box>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      {/* Search Bar */}
      <Box mb={4} component="form" onSubmit={handleSearchSubmit}>
        <TextField
          placeholder="Search by company name or role..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <Button type="submit" variant="contained" size="small" sx={{ fontWeight: 'bold' }}>
                Search
              </Button>
            ),
          }}
        />
      </Box>

      {companies.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No active recruitment drives match your query parameters.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {companies.map((company) => {
            const hasApplied = appliedCompanyIds.has(company.companyId);
            const expired = isDeadlinePassed(company.lastDate);
            const meetsCgpa = studentProfile.cgpa === null || studentProfile.cgpa >= company.eligibilityCriteria;
            const hasResume = !!studentProfile.resumeUrl;
            
            // Determine button state
            let buttonText = 'Apply Now';
            let buttonDisabled = false;
            let buttonColor: 'primary' | 'success' | 'warning' | 'error' | 'inherit' = 'primary';
            let warningMessage = '';

            if (hasApplied) {
              buttonText = 'Applied';
              buttonDisabled = true;
              buttonColor = 'success';
            } else if (expired) {
              buttonText = 'Deadline Passed';
              buttonDisabled = true;
              buttonColor = 'inherit';
              warningMessage = 'This drive has already closed.';
            } else if (!hasResume) {
              buttonText = 'Resume Required';
              buttonDisabled = true;
              buttonColor = 'warning';
              warningMessage = 'Upload resume in profile first.';
            } else if (!meetsCgpa) {
              buttonText = 'Not Eligible';
              buttonDisabled = true;
              buttonColor = 'error';
              warningMessage = `Min CGPA required is ${company.eligibilityCriteria}, yours is ${studentProfile.cgpa}.`;
            }

            return (
              <Grid item xs={12} md={6} key={company.companyId}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {company.companyName}
                        </Typography>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">
                          {company.role}
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
                        <Chip 
                          icon={<AttachMoney />} 
                          label={`${company.packageAmount} LPA`} 
                          color="secondary" 
                          size="small" 
                          sx={{ fontWeight: 'bold' }} 
                        />
                        <Chip 
                          label={`Min CGPA: ${company.eligibilityCriteria}`} 
                          color={meetsCgpa ? 'default' : 'error'} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontWeight: 'bold', mt: 0.5 }} 
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1, minHeight: 60 }}>
                      {company.description || 'No job description provided.'}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} color="text.secondary" mb={2}>
                      <CalendarToday sx={{ fontSize: 16 }} />
                      <Typography variant="caption" fontWeight="bold">
                        Deadline: {new Date(company.lastDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      {buttonDisabled && warningMessage ? (
                        <Tooltip title={warningMessage}>
                          <Box display="flex" alignItems="center" mr={1} color={buttonColor === 'error' ? 'error.main' : 'warning.main'}>
                            {buttonColor === 'error' ? <Block size={18} /> : <WarningAmber size={18} />}
                          </Box>
                        </Tooltip>
                      ) : null}

                      <Button
                        variant={hasApplied ? 'contained' : 'contained'}
                        color={buttonColor}
                        fullWidth
                        onClick={() => handleApply(company.companyId)}
                        disabled={buttonDisabled || applyingId === company.companyId}
                        startIcon={hasApplied ? <AssignmentTurnedIn /> : undefined}
                        sx={{ fontWeight: 'bold', borderRadius: 2 }}
                      >
                        {applyingId === company.companyId ? 'Submitting...' : buttonText}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default StudentCompanies;
