import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress } from '@mui/material';
import { Send, AccountBalance, Analytics, Info } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Application {
  applicationId: number;
  companyName: string;
  companyRole: string;
  companyPackage: number;
  status: string;
  applicationDate: string;
  matchScore: number | null;
  studentSkills: string | null;
  companyDescription: string | null;
}

const StudentApplications: React.FC = () => {
  const { user } = useAuth();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        const response = await api.get(`/api/applications/student/${user.id}?size=100`);
        setApplications(response.data.content);
      } catch (err: any) {
        setError('Failed to load your application logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SELECTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'SHORTLISTED':
        return 'warning';
      case 'INTERVIEW_SCHEDULED':
        return 'secondary';
      case 'APPLIED':
      default:
        return 'primary';
    }
  };

  const getMatchScoreColor = (score: number | null) => {
    if (score === null) return 'text.secondary';
    if (score >= 80) return 'success.main';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };

  const handleOpenDetails = (app: Application) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedApp(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track interview timelines, shortlist reviews, and confirmed offers.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {applications.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          You have not applied for any placement opportunities yet.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Application ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Job Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Package Offered</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Applied</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Review Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>AI Match Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.applicationId} hover>
                  <TableCell>#{app.applicationId}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{app.companyName}</TableCell>
                  <TableCell>{app.companyRole}</TableCell>
                  <TableCell>{app.companyPackage} LPA</TableCell>
                  <TableCell>
                    {new Date(app.applicationDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={app.status.replace('_', ' ')} 
                      color={getStatusColor(app.status)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>
                    {app.matchScore !== null ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography 
                          variant="body2" 
                          fontWeight="bold" 
                          sx={{ color: getMatchScoreColor(app.matchScore) }}
                        >
                          {app.matchScore}%
                        </Typography>
                        <Button 
                          size="small" 
                          variant="text" 
                          startIcon={<Info sx={{ fontSize: '1rem' }} />}
                          onClick={() => handleOpenDetails(app)}
                          sx={{ minWidth: 0, p: 0.5 }}
                        >
                          Details
                        </Button>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">N/A</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Match Details Dialog */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Analytics color="primary" /> AI Candidate Matching Analysis
        </DialogTitle>
        <DialogContent dividers>
          {selectedApp && (
            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Overall Skill & Eligibility Fit
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Box flexGrow={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedApp.matchScore || 0} 
                      color={
                        (selectedApp.matchScore || 0) >= 80 ? 'success' :
                        (selectedApp.matchScore || 0) >= 50 ? 'warning' : 'error'
                      }
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedApp.matchScore}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {(selectedApp.matchScore || 0) >= 80 ? 'Excellent match: candidate skills and CGPA align closely with this job specification.' :
                   (selectedApp.matchScore || 0) >= 50 ? 'Moderate match: some skills overlap. Candidate might benefit from upskilling in required areas.' :
                   'Low match score: minimal skill overlap or mismatch in candidate eligibility criteria.'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  Extracted Candidate Skills:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                  {selectedApp.studentSkills ? (
                    selectedApp.studentSkills.split(',').map((skill, index) => (
                      <Chip key={index} label={skill.trim()} size="small" color="primary" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No skills registered on profile or resume.</Typography>
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  Job Description Focus Areas:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap', bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                  {selectedApp.companyDescription || 'No description available.'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentApplications;
