import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Divider } from '@mui/material';
import { Assessment, PictureAsPdf, Download } from '@mui/icons-material';
import api from '../../services/api';

interface StatsData {
  totalStudents: number;
  totalCompanies: number;
  totalApplications: number;
  totalSelectedStudents: number;
  placementPercentage: number;
  highestPackage: number;
  averagePackage: number;
}

const Reports: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/stats');
        setStats(response.data);
      } catch (err: any) {
        setError('Failed to load summary stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    setError(null);
    setSuccess(null);

    try {
      // Fetch report as a binary blob
      const response = await api.get('/api/reports/download', {
        responseType: 'blob',
      });

      // Create browser download link
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `campus_placement_report_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up link
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);

      setSuccess('Consolidated PDF report downloaded successfully.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError('Failed to generate and download PDF report. Ensure backend has OpenPDF compiler dependencies.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return <Alert severity="error">{error || 'Failed to load report metrics.'}</Alert>;
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Generate Placement Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Export campus placement drives history logs and executive summaries as PDF documents.
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Executive Summary List */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Executive Summary (Consolidated Data)
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Table>
                  <TableBody>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total Enrolled Students</TableCell>
                      <TableCell align="right">{stats.totalStudents}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>Participating Recruiter Companies</TableCell>
                      <TableCell align="right">{stats.totalCompanies}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total Applications Submitted</TableCell>
                      <TableCell align="right">{stats.totalApplications}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>Selected Candidates (Hired)</TableCell>
                      <TableCell align="right">{stats.totalSelectedStudents}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>Placement Percentage Rate</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {stats.placementPercentage} %
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>Highest CTC Package Offered</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{stats.highestPackage} LPA</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>Average CTC Package Offered</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{stats.averagePackage} LPA</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* PDF Generator Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, textAlign: 'center', gap: 3 }}>
              <Box p={3} sx={{ borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Assessment color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Placement Report Compilation
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph px={2}>
                  Compiles executive summaries, campus drive counters, CTC highlights, and lists of recruited candidates in an A4 PDF document.
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<PictureAsPdf />}
                endIcon={<Download />}
                onClick={handleDownloadPdf}
                disabled={downloading}
                sx={{ mt: 2, py: 1.5, px: 4, fontWeight: 'bold', borderRadius: 2 }}
              >
                {downloading ? 'Compiling Report...' : 'Download PDF Report'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
