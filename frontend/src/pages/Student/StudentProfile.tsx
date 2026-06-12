import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, TextField, Button, Grid, MenuItem, Alert, CircularProgress, Paper, Divider } from '@mui/material';
import { CloudUpload, PictureAsPdf, Link, Save } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const currentYear = new Date().getFullYear();
const gradYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    cgpa: '',
    graduationYear: currentYear,
    skills: '',
    resumeUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/students/${user.id}`);
        const data = response.data;
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          branch: data.branch || '',
          cgpa: data.cgpa ? String(data.cgpa) : '',
          graduationYear: data.graduationYear || currentYear,
          skills: data.skills || '',
          resumeUrl: data.resumeUrl || '',
        });
      } catch (err: any) {
        setError('Failed to load student profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are supported.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be smaller than 5MB.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const cgpaNum = parseFloat(formData.cgpa);
    if (formData.cgpa && (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10)) {
      setError('CGPA must be a valid number between 0.00 and 10.00.');
      setSaving(false);
      return;
    }

    try {
      const response = await api.put(`/api/students/${user.id}`, {
        ...formData,
        cgpa: formData.cgpa ? cgpaNum : null,
      });

      setSuccess('Profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        name: response.data.name,
        phone: response.data.phone,
        cgpa: response.data.cgpa ? String(response.data.cgpa) : '',
        branch: response.data.branch,
        graduationYear: response.data.graduationYear,
        skills: response.data.skills,
      }));
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save profile changes.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const uploadForm = new FormData();
    uploadForm.append('file', selectedFile);

    try {
      const response = await api.post(`/api/students/${user.id}/resume`, uploadForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Resume uploaded successfully!');
      setFormData((prev) => ({ ...prev, resumeUrl: response.data.resumeUrl }));
      setSelectedFile(null);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to upload PDF resume file.');
      }
    } finally {
      setUploading(false);
    }
  };

  const getFullResumeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Keep your contact information, marks, and resume updated to qualify for recruitment drives.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      <Grid container spacing={4}>
        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Personal & Academic Details
              </Typography>
              <form onSubmit={handleProfileSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      name="name"
                      required
                      fullWidth
                      value={formData.name}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      required
                      fullWidth
                      value={formData.email}
                      disabled
                      helperText="Email address cannot be changed."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phone"
                      fullWidth
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Branch"
                      name="branch"
                      required
                      fullWidth
                      value={formData.branch}
                      onChange={handleChange}
                      disabled={saving}
                    >
                      {branches.map((b) => (
                        <MenuItem key={b} value={b}>{b}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CGPA (Out of 10.00)"
                      name="cgpa"
                      required
                      fullWidth
                      value={formData.cgpa}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Graduation Year"
                      name="graduationYear"
                      required
                      fullWidth
                      value={formData.graduationYear}
                      onChange={handleChange}
                      disabled={saving}
                    >
                      {gradYears.map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Skills Inventory (Comma separated)"
                      name="skills"
                      placeholder="e.g. React, Spring Boot, MySQL"
                      fullWidth
                      multiline
                      rows={2}
                      value={formData.skills}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      startIcon={<Save />}
                      disabled={saving}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {saving ? 'Saving Changes...' : 'Save Profile'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Resume Manager Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Resume Management
              </Typography>
              <Divider />

              {formData.resumeUrl ? (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2.5, 
                    border: 1, 
                    borderColor: 'success.light', 
                    bgcolor: (theme) => theme.palette.mode === 'light' ? '#e8f5e9' : '#064e3b',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <PictureAsPdf color="success" sx={{ fontSize: 36 }} />
                  <Box flexGrow={1}>
                    <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold' }}>
                      Resume Uploaded
                    </Typography>
                    <Button 
                      href={getFullResumeUrl(formData.resumeUrl)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      variant="text" 
                      size="small" 
                      startIcon={<Link />}
                      sx={{ p: 0, fontWeight: 'bold', mt: 0.5 }}
                    >
                      Open PDF File
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2.5, 
                    border: 1, 
                    borderColor: 'warning.light', 
                    bgcolor: (theme) => theme.palette.mode === 'light' ? '#fffde7' : '#78350f',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <PictureAsPdf color="warning" sx={{ fontSize: 36 }} />
                  <Box>
                    <Typography variant="subtitle2" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      No Resume Found
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      You must upload a PDF resume file to apply for placement opportunities.
                    </Typography>
                  </Box>
                </Paper>
              )}

              <Box>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
                  Upload New Resume
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Select a new PDF file to overwrite your existing resume. Max file size: 5MB.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ py: 1.5, borderStyle: 'dashed', borderRadius: 2 }}
                  >
                    Choose PDF Resume
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      hidden 
                      onChange={handleFileChange} 
                    />
                  </Button>

                  {selectedFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <PictureAsPdf color="action" sx={{ fontSize: 18 }} />
                      <Typography variant="caption" noWrap flexGrow={1} sx={{ fontWeight: 'bold' }}>
                        {selectedFile.name}
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={handleResumeUpload}
                        disabled={uploading}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentProfile;
