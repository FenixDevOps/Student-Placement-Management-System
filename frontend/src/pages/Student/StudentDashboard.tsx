import React, { useState, useEffect } from 'react';
import { Box as MuiBox, Grid as MuiGrid, Card as MuiCard, CardContent as MuiCardContent, Typography as MuiTypography, Button as MuiButton, Chip, Divider, CircularProgress, Alert, Paper } from '@mui/material';
import { Send, CheckCircle, HourglassEmpty, Cancel, Warning, AccountCircle, Business } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Application {
  applicationId: number;
  companyName: string;
  companyRole: string;
  companyPackage: number;
  status: string;
  applicationDate: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [profileComplete, setProfileComplete] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch student profile details to check if resume is uploaded
        const profileRes = await api.get(`/api/students/${user.id}`);
        setProfileComplete(!!profileRes.data.resumeUrl);

        // Fetch student's applications
        const appsRes = await api.get(`/api/applications/student/${user.id}?size=100`);
        const appsList: Application[] = appsRes.data.content;
        setApplications(appsList);

        // Calculate stats
        const counts = {
          applied: 0,
          shortlisted: 0,
          interview: 0,
          selected: 0,
          rejected: 0,
        };

        appsList.forEach((app) => {
          const status = app.status.toUpperCase();
          if (status === 'APPLIED') counts.applied++;
          else if (status === 'SHORTLISTED') counts.shortlisted++;
          else if (status === 'INTERVIEW_SCHEDULED') counts.interview++;
          else if (status === 'SELECTED') counts.selected++;
          else if (status === 'REJECTED') counts.rejected++;
        });

        setStats(counts);
      } catch (err: any) {
        setError('Failed to fetch dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <MuiBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </MuiBox>
    );
  }

  return (
    <MuiBox>
      <MuiBox mb={4}>
        <MuiTypography variant="h4" fontWeight="bold" gutterBottom>
          Welcome, {user?.name}!
        </MuiTypography>
        <MuiTypography variant="body1" color="text.secondary">
          Track your active campus placement drives and job application statuses.
        </MuiTypography>
      </MuiBox>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {!profileComplete && (
        <Alert 
          severity="warning" 
          icon={<Warning />}
          action={
            <MuiButton color="inherit" size="small" onClick={() => navigate('/student/profile')} sx={{ fontWeight: 'bold' }}>
              Upload Now
            </MuiButton>
          }
          sx={{ mb: 4, borderRadius: 2 }}
        >
          Your placement profile is incomplete. Please upload your PDF resume to unlock applications for recruiter drives.
        </Alert>
      )}

      {/* KPI Counters */}
      <MuiGrid container spacing={3} mb={5}>
        <MuiGrid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="APPLIED"
            value={stats.applied}
            icon={<Send />}
            color="primary"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="SHORTLISTED"
            value={stats.shortlisted}
            icon={<HourglassEmpty />}
            color="warning"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="INTERVIEWS"
            value={stats.interview}
            icon={<Business />}
            color="secondary"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="SELECTED"
            value={stats.selected}
            icon={<CheckCircle />}
            color="success"
          />
        </MuiGrid>
        <MuiGrid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="REJECTED"
            value={stats.rejected}
            icon={<Cancel />}
            color="error"
          />
        </MuiGrid>
      </MuiGrid>

      <MuiGrid container spacing={4}>
        {/* Recent Applications Table List */}
        <MuiGrid item xs={12} md={8}>
          <MuiCard sx={{ height: '100%' }}>
            <MuiCardContent sx={{ p: 3 }}>
              <MuiBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MuiTypography variant="h6" fontWeight="bold">
                  Recent Applications
                </MuiTypography>
                <MuiButton size="small" onClick={() => navigate('/student/applications')} sx={{ fontWeight: 'bold' }}>
                  View All
                </MuiButton>
              </MuiBox>
              <Divider sx={{ mb: 2 }} />

              {applications.length === 0 ? (
                <MuiBox py={6} textAlign="center">
                  <MuiTypography color="text.secondary" paragraph>
                    You have not submitted any job applications yet.
                  </MuiTypography>
                  <MuiButton variant="contained" onClick={() => navigate('/student/companies')} sx={{ fontWeight: 'bold' }}>
                    Browse Recruiter Opportunities
                  </MuiButton>
                </MuiBox>
              ) : (
                <MuiBox display="flex" flexDirection="column" gap={2}>
                  {applications.slice(0, 5).map((app) => (
                    <MuiBox 
                      key={app.applicationId}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      sx={{ 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 2,
                        bgcolor: 'background.default',
                      }}
                    >
                      <MuiBox>
                        <MuiTypography fontWeight="bold" variant="body1">
                          {app.companyName}
                        </MuiTypography>
                        <MuiTypography variant="body2" color="text.secondary">
                          {app.companyRole} &bull; {app.companyPackage} LPA
                        </MuiTypography>
                      </MuiBox>
                      <MuiBox display="flex" alignItems="center" gap={2}>
                        <Chip 
                          label={app.status} 
                          color={
                            app.status === 'SELECTED' ? 'success' :
                            app.status === 'REJECTED' ? 'error' :
                            app.status === 'SHORTLISTED' ? 'warning' :
                            app.status === 'INTERVIEW_SCHEDULED' ? 'secondary' : 'default'
                          }
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </MuiBox>
                    </MuiBox>
                  ))}
                </MuiBox>
              )}
            </MuiCardContent>
          </MuiCard>
        </MuiGrid>

        {/* Shortcut Quick links panel */}
        <MuiGrid item xs={12} md={4}>
          <MuiCard sx={{ height: '100%' }}>
            <MuiCardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <MuiTypography variant="h6" fontWeight="bold">
                Quick Shortcuts
              </MuiTypography>
              <Divider />

              <MuiButton 
                variant="outlined" 
                fullWidth 
                startIcon={<AccountCircle />}
                onClick={() => navigate('/student/profile')}
                sx={{ py: 1.5, justifyContent: 'flex-start', pl: 3, borderRadius: 2 }}
              >
                Edit Profile Info
              </MuiButton>

              <MuiButton 
                variant="outlined" 
                fullWidth 
                startIcon={<Business />}
                onClick={() => navigate('/student/companies')}
                sx={{ py: 1.5, justifyContent: 'flex-start', pl: 3, borderRadius: 2 }}
              >
                Browse Companies
              </MuiButton>

              <MuiBox 
                p={2.5} 
                sx={{ 
                  borderRadius: 3, 
                  bgcolor: (theme) => theme.palette.mode === 'light' ? '#e3f2fd' : '#1e293b',
                  mt: 'auto',
                }}
              >
                <MuiTypography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                  Placement Cell Notice
                </MuiTypography>
                <MuiTypography variant="caption" color="text.secondary">
                  Please verify your CGPA scores before submitting applications. Falsifying marks will lead to permanent debarment from campus recruitment.
                </MuiTypography>
              </MuiBox>
            </MuiCardContent>
          </MuiCard>
        </MuiGrid>
      </MuiGrid>
    </MuiBox>
  );
};

export default StudentDashboard;
