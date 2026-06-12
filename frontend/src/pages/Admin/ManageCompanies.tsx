import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, CircularProgress, Divider } from '@mui/material';
import { Add, Edit, Delete, Business, CalendarToday, AttachMoney, AssignmentInd } from '@mui/icons-material';
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

const ManageCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [packageAmount, setPackageAmount] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [description, setDescription] = useState('');
  const [lastDate, setLastDate] = useState('');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/companies?size=100');
      setCompanies(response.data.content);
    } catch (err: any) {
      setError('Failed to load companies drives listing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setSelectedCompanyId(null);
    setCompanyName('');
    setRole('');
    setPackageAmount('');
    setEligibilityCriteria('');
    setDescription('');
    setLastDate('');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (company: Company) => {
    setDialogMode('edit');
    setSelectedCompanyId(company.companyId);
    setCompanyName(company.companyName);
    setRole(company.role);
    setPackageAmount(String(company.packageAmount));
    setEligibilityCriteria(String(company.eligibilityCriteria));
    setDescription(company.description || '');
    setLastDate(company.lastDate);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !role || !packageAmount || !eligibilityCriteria || !lastDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const pkgVal = parseFloat(packageAmount);
    const cgpaVal = parseFloat(eligibilityCriteria);

    if (isNaN(pkgVal) || pkgVal <= 0) {
      setError('Package amount must be a valid positive number.');
      return;
    }
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      setError('Eligibility criteria CGPA must be between 0.00 and 10.00.');
      return;
    }

    setError(null);
    setSuccess(null);

    const payload = {
      companyName,
      role,
      packageAmount: pkgVal,
      eligibilityCriteria: cgpaVal,
      description,
      lastDate,
    };

    try {
      if (dialogMode === 'add') {
        await api.post('/api/companies', payload);
        setSuccess('Recruitment drive added successfully!');
      } else if (dialogMode === 'edit' && selectedCompanyId !== null) {
        await api.put(`/api/companies/${selectedCompanyId}`, payload);
        setSuccess('Recruitment drive updated successfully!');
      }
      handleCloseDialog();
      fetchCompanies();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save recruitment drive details.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this company opportunity and all associated applications?')) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await api.delete(`/api/companies/${id}`);
      setSuccess('Recruitment drive deleted successfully!');
      fetchCompanies();
    } catch (err: any) {
      setError('Failed to delete recruitment drive.');
    }
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Manage Corporate Recruiters
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Publish job roles, adjust compensation packages, and set application deadlines.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleOpenAddDialog}
          sx={{ fontWeight: 'bold' }}
        >
          Add Drive
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : companies.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>No recruitment drives found. Click 'Add Drive' to create one.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Job Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Package CTC</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Eligible CGPA</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Deadline Limit</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.companyId} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>{company.companyName}</TableCell>
                  <TableCell>{company.role}</TableCell>
                  <TableCell>{company.packageAmount} LPA</TableCell>
                  <TableCell>{company.eligibilityCriteria.toFixed(2)} CGPA</TableCell>
                  <TableCell>
                    {new Date(company.lastDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(company)} sx={{ mr: 1 }}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(company.companyId)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {dialogMode === 'add' ? 'Create Recruitment Drive' : 'Edit Recruitment Drive'}
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Box display="flex" flexDirection="column" gap={3} mt={1}>
              <TextField
                label="Company Name"
                required
                fullWidth
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <TextField
                label="Job Designation Role"
                required
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Salary Package (LPA)"
                    required
                    fullWidth
                    placeholder="e.g. 12.5"
                    value={packageAmount}
                    onChange={(e) => setPackageAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Min CGPA Criteria"
                    required
                    fullWidth
                    placeholder="e.g. 8.0"
                    value={eligibilityCriteria}
                    onChange={(e) => setEligibilityCriteria(e.target.value)}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Application Deadline"
                type="date"
                required
                fullWidth
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Job Description"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ fontWeight: 'bold' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ fontWeight: 'bold' }}>
              {dialogMode === 'add' ? 'Create Drive' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ManageCompanies;
