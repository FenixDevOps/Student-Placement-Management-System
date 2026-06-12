import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Button, Grid, IconButton, Chip, CircularProgress, Alert, Pagination, InputAdornment } from '@mui/material';
import { Search, PictureAsPdf, FilterList, Star } from '@mui/icons-material';
import api, { API_BASE_URL } from '../../services/api';

interface Student {
  studentId: number;
  name: string;
  email: string;
  phone: string;
  branch: string;
  cgpa: number;
  graduationYear: number;
  skills: string;
  resumeUrl: string | null;
}

const branches = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [branch, setBranch] = useState('All');
  const [minCgpa, setMinCgpa] = useState('');
  const [search, setSearch] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const fetchStudents = async (currentPage = page, activeBranch = branch, activeCgpa = minCgpa, activeSearch = search) => {
    try {
      setLoading(true);
      setError(null);

      const branchQuery = activeBranch === 'All' ? '' : activeBranch;
      
      const response = await api.get('/api/students', {
        params: {
          branch: branchQuery,
          minCgpa: activeCgpa || undefined,
          search: activeSearch || undefined,
          page: currentPage - 1,
          size: pageSize,
          sortBy: 'name',
          direction: 'asc',
        },
      });

      setStudents(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError('Failed to load student profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1); // Reset page to 1 when filters change is usually handled inside handlers
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents(1, branch, minCgpa, search);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchStudents(value, branch, minCgpa, search);
  };

  const handleClearFilters = () => {
    setBranch('All');
    setMinCgpa('');
    setSearch('');
    setPage(1);
    fetchStudents(1, 'All', '', '');
  };

  const getFullResumeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Manage Placement Students
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse enrolled candidate details, screen academic qualifications, and examine uploaded PDF resumes.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Filter and Search Panel */}
      <Card sx={{ mb: 4, p: 1 }}>
        <CardContent>
          <form onSubmit={handleFilterSubmit}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  placeholder="Search by student name or skills..."
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
              <Grid item xs={12} sm={2.5}>
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
              <Grid item xs={12} sm={2.5}>
                <TextField
                  label="Minimum CGPA"
                  placeholder="e.g. 8.0"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3} display="flex" gap={1}>
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

      {/* Student List Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : students.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>No student profiles matched the filter criteria.</Alert>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email / Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Branch</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>CGPA</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Grad Year</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Skills Inventory</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Resume PDF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.studentId} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{student.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{student.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{student.phone || 'No Phone'}</Typography>
                    </TableCell>
                    <TableCell><Chip label={student.branch} size="small" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} /></TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell>{student.graduationYear}</TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      {student.skills ? (
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {student.skills.split(',').map((skill, index) => (
                            <Chip 
                              key={index} 
                              label={skill.trim()} 
                              size="small" 
                              sx={{ fontSize: '0.675rem' }} 
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">No skills listed</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {student.resumeUrl ? (
                        <IconButton 
                          color="success" 
                          href={getFullResumeUrl(student.resumeUrl)} 
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
    </Box>
  );
};

export default ManageStudents;
