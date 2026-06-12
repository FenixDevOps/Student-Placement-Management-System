import React from 'react';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string; // Optional custom background gradient or color
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, color }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -20, 
          right: -20, 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          bgcolor: color || 'primary.light', 
          opacity: 0.1,
        }} 
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: 3 }}>
        <Box display="flex" alignItems="center" width="100%" gap={2.5}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 1.5, 
              bgcolor: color ? `${color}.light` : 'primary.light', 
              color: color ? `${color}.contrastText` : 'primary.contrastText',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Paper>
          <Box flexGrow={1}>
            <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
