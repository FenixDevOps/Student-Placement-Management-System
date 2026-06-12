import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Button, Grid, IconButton, Chip, CircularProgress, Alert, Pagination, InputAdornment, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress } from '@mui/material';
import { Search, PictureAsPdf, FilterList, Check, AssignmentInd, Business, Analytics, Info } from '@mui/icons-material';
import api from '../../services/api';

interface Application {
  applicationId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentBranch: string;
  studentCgpa: number;
  studentResumeUrl: string | null;
  companyId: number;
  companyName: string;
  companyRole: string;
  companyPackage: number;
  status: string;
  applicationDate: string;
  matchScore: number | null;
  studentSkills: string | null;
  companyDescription: string | null;
}

const branches = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const statuses = ['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
const dbStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'];

const ManageApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State for Match Details
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter States
  const [branch, setBranch] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const fetchApplications = async (currentPage = page, activeBranch = branch, activeStatus = status, activeSearch = search) => {
    try {
      setLoading(true);
      setError(null);

      const branchQuery = activeBranch === 'All' ? '' : activeBranch;
      const statusQuery = activeStatus === 'All' ? '' : activeStatus.toUpperCase().replace(' ', '_');

      const response = await api.get('/api/applications', {
        params: {
          branch: branchQuery,
          status: statusQuery || undefined,
          search: activeSearch || undefined,
          page: currentPage - 1,
          size: pageSize,
          sortBy: 'applicationDate',
          direction: 'desc',
        },
      });

      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError('Failed to load job applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1);
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications(1, branch, status, search);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchApplications(value, branch, status, search);
  };

  const handleClearFilters = () => {
    setBranch('All');
    setStatus('All');
    setSearch('');
    setPage(1);
    fetchApplications(1, 'All', 'All', '');
  };

  const handleStatusChange = async (applicationId: number, nextStatus: string) => {
    setError(null);
    setSuccess(null);
    
    try {
      await api.put(`/api/applications/status/${applicationId}`, {
        status: nextStatus,
      });

      setSuccess(`Application status successfully updated to ${nextStatus.replace('_', ' ')}. Notification email dispatched.`);
      
      // Update local state without fetching again to prevent spinner flashing
      setApplications((prev) => 
        prev.map((app) => 
          app.applicationId === applicationId ? { ...app, status: nextStatus } : app
        )
      );

      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError('Failed to update application status.');
    }
  };

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus.toUpperCase()) {
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

  const getFullResumeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
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

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Manage Placements Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Screen student candidate registrations, retrieve PDF files, and route hiring status workflows.
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Filter and Search Panel */}
      <Card sx={{ mb: 4, p: 1 }}>
        <CardContent>
          <form onSubmit={handleFilterSubmit}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3.5}>
                <TextField
                  placeholder="Search student, company, or role..."
                  variant="outlined"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2.25}>
                <TextField
                  select
                  label="Branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  fullWidth
                >
                  {branches.map((b) => (
                    <MenuItem key={b} value={b}>{b}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2.25}>
                <TextField
                  select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4} display="flex" gap={1}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  startIcon={<FilterList />}
                  sx={{ fontWeight: 'bold', py: 1.5 }}
                >
                  Filter
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleClearFilters}
                  sx={{ fontWeight: 'bold', py: 1.5 }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Applications List */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>No applications found matching the selected filter criteria.</Alert>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student Details</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Company & Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>CGPA / Branch</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Applied Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>AI Match Score</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hiring Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Resume</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.applicationId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{app.studentName}</Typography>
                      <Typography variant="caption" color="text.secondary">{app.studentEmail}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{app.companyName}</Typography>
                      <Typography variant="caption" color="primary" display="block">{app.companyRole} &bull; {app.companyPackage} LPA</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{app.studentCgpa ? app.studentCgpa.toFixed(2) : 'N/A'}</Typography>
                      <Chip label={app.studentBranch} size="small" variant="outlined" sx={{ fontSize: '0.675rem', fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>
                      {new Date(app.applicationDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
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
                            startIcon={<Info sx={{ fontSize: '0.9rem' }} />}
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
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.applicationId, e.target.value)}
                          sx={{ 
                            fontWeight: 'bold',
                            color: `${getStatusColor(app.status)}.main`,
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'divider',
                            },
                          }}
                        >
                          {dbStatuses.map((st) => (
                            <MenuItem key={st} value={st}>
                              <Chip 
                                label={st.replace('_', ' ')} 
                                color={getStatusColor(st)} 
                                size="small" 
                                sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} 
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {app.studentResumeUrl ? (
                        <IconButton 
                          color="success" 
                          href={getFullResumeUrl(app.studentResumeUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <PictureAsPdf />
                        </IconButton>
                      ) : (
                        <Typography variant="caption" color="text.secondary">None</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              shape="rounded"
            />
          </Box>
        </Box>
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

export default ManageApplications;
