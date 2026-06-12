import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert, Card, CardContent, Divider } from '@mui/material';
import { People, Business, Assignment, CheckCircle, Speed, TrendingUp } from '@mui/icons-material';
import StatCard from '../../components/StatCard';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface BranchStat {
  branch: string;
  totalStudents: number;
  placedStudents: number;
}

interface StatusStat {
  status: string;
  count: number;
}

interface StatsData {
  totalStudents: number;
  totalCompanies: number;
  totalApplications: number;
  totalSelectedStudents: number;
  placementPercentage: number;
  highestPackage: number;
  averagePackage: number;
  branchPlacedStats: BranchStat[];
  statusStats: StatusStat[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/stats');
        setStats(response.data);
      } catch (err: any) {
        setError('Failed to fetch placement analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return <Alert severity="error">{error || 'Failed to load stats.'}</Alert>;
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Placement Administrator Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor real-time recruitment updates, drive details, and candidate analytics.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TOTAL STUDENTS"
            value={stats.totalStudents}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TOTAL RECRUITERS"
            value={stats.totalCompanies}
            icon={<Business />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TOTAL APPLICATIONS"
            value={stats.totalApplications}
            icon={<Assignment />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="PLACED CANDIDATES"
            value={stats.totalSelectedStudents}
            icon={<CheckCircle />}
            color="success"
            subtitle={`${stats.placementPercentage}% Placement Rate`}
          />
        </Grid>
      </Grid>

      {/* Salary Highlights */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 1, bgcolor: (theme) => theme.palette.mode === 'light' ? '#e8f5e9' : '#064e3b' }}>
            <CardContent display="flex" alignItems="center" gap={2}>
              <Box display="flex" gap={2} alignItems="center">
                <Box p={1.5} bgcolor="success.main" color="white" borderRadius={3} display="flex" alignItems="center">
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">HIGHEST CTC OFFERED</Typography>
                  <Typography variant="h5" fontWeight="extrabold">{stats.highestPackage} LPA</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 1, bgcolor: (theme) => theme.palette.mode === 'light' ? '#e3f2fd' : '#1e3a8a' }}>
            <CardContent display="flex" alignItems="center" gap={2}>
              <Box display="flex" gap={2} alignItems="center">
                <Box p={1.5} bgcolor="primary.main" color="white" borderRadius={3} display="flex" alignItems="center">
                  <Speed />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">AVERAGE CTC PACKAGE</Typography>
                  <Typography variant="h5" fontWeight="extrabold">{stats.averagePackage} LPA</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4}>
        {/* Branch placements comparative bars */}
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Branch-wise Placements Comparative Analysis
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box height={350} width="100%">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.branchPlacedStats}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branch" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="totalStudents" name="Enrolled Students" fill="#90caf9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placedStudents" name="Placed Students" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Application status pie breakdown */}
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Applications Breakdown by Hiring Status
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box height={350} display="flex" justifyContent="center" alignItems="center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusStats.filter(s => s.count > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {stats.statusStats.filter(s => s.count > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(value) => [`${value} applications`, 'Volume']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
