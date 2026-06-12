import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Chip } from '@mui/material';
import { CalendarMonth, AccessTime, Info, Link, Room, Note } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Interview {
  interviewId: number;
  applicationId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  companyId: number;
  companyName: string;
  companyRole: string;
  scheduledTime: string;
  durationMinutes: number;
  roundName: string;
  locationOrLink: string | null;
  notes: string | null;
}

const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchInterviews = async () => {
      try {
        const response = await api.get(`/api/interviews/student/${user.id}`);
        setInterviews(response.data);
      } catch (err: any) {
        setError('Failed to load your scheduled interviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  // Convert interviews to FullCalendar format
  const calendarEvents = interviews.map((item) => {
    const start = new Date(item.scheduledTime);
    const end = new Date(start.getTime() + item.durationMinutes * 60000);
    return {
      id: item.interviewId.toString(),
      title: `${item.companyName} - ${item.roundName}`,
      start: start,
      end: end,
      extendedProps: item,
      color: item.roundName.toLowerCase().includes('hr') ? '#e91e63' :
             item.roundName.toLowerCase().includes('tech') ? '#00bcd4' : '#4caf50',
    };
  });

  const handleEventClick = (info: any) => {
    setSelectedInterview(info.event.extendedProps as Interview);
    setDialogOpen(true);
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
          Interview Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track upcoming recruitment rounds, joining links, and coordinator guidance.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <CardContent>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek',
                }}
                height="70vh"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Next Scheduled Rounds
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {interviews
              .filter(item => new Date(item.scheduledTime) >= new Date())
              .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
              .slice(0, 3)
              .map((item) => (
                <Card 
                  key={item.interviewId} 
                  sx={{ 
                    borderRadius: 2.5, 
                    borderLeft: 6, 
                    borderColor: item.roundName.toLowerCase().includes('hr') ? '#e91e63' :
                                item.roundName.toLowerCase().includes('tech') ? '#00bcd4' : '#4caf50' 
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {item.companyName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {item.companyRole}
                    </Typography>
                    <Chip label={item.roundName} size="small" sx={{ my: 1, fontWeight: 'bold' }} />
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                      <AccessTime sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.scheduledTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            {interviews.filter(item => new Date(item.scheduledTime) >= new Date()).length === 0 && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>No upcoming interviews scheduled!</Alert>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonth color="primary" /> Interview Details
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selectedInterview && (
            <>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selectedInterview.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {selectedInterview.companyRole}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5}>
                <Chip label={selectedInterview.roundName} color="primary" sx={{ fontWeight: 'bold' }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedInterview.durationMinutes} mins
                </Typography>
              </Box>

              <Box display="flex" alignItems="flex-start" gap={1}>
                <AccessTime sx={{ mt: 0.2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Time:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedInterview.scheduledTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="flex-start" gap={1}>
                {selectedInterview.locationOrLink?.startsWith('http') ? (
                  <>
                    <Link sx={{ mt: 0.2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Join Link:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        component="a" 
                        href={selectedInterview.locationOrLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ color: 'primary.main', textDecoration: 'underline' }}
                      >
                        Click to Join
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Room sx={{ mt: 0.2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Location:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedInterview.locationOrLink || 'To be announced'}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>

              {selectedInterview.notes && (
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <Note sx={{ mt: 0.2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Coordinator Notes:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedInterview.notes}
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarView;
