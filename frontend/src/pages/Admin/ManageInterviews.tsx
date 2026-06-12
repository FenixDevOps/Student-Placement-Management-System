import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Chip, IconButton } from '@mui/material';
import { Add, Delete, Edit, CalendarMonth, AccessTime, Link, Room, People, Note } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
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

interface Application {
  applicationId: number;
  studentName: string;
  companyName: string;
  companyRole: string;
}

const ManageInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog state for Creating / Editing
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | null>(null);

  // Form Fields
  const [applicationId, setApplicationId] = useState<number | ''>('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [roundName, setRoundName] = useState('Technical Round 1');
  const [locationOrLink, setLocationOrLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // View Dialog state
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingInterview, setViewingInterview] = useState<Interview | null>(null);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/interviews');
      // The endpoint returns Page<InterviewDto>, let's inspect the payload
      const data = response.data.content || response.data;
      setInterviews(data);
    } catch (err: any) {
      setError('Failed to fetch scheduled interviews.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications', { params: { size: 100 } });
      setApplications(response.data.content || []);
    } catch (err: any) {
      console.error('Failed to fetch applications for scheduling dropdown.', err);
    }
  };

  useEffect(() => {
    fetchInterviews();
    fetchApplications();
  }, []);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setSelectedInterviewId(null);
    setApplicationId('');
    setScheduledTime('');
    setDurationMinutes(60);
    setRoundName('Technical Round 1');
    setLocationOrLink('');
    setNotes('');
    setOpenDialog(true);
  };

  const handleOpenEdit = (interview: Interview) => {
    setIsEdit(true);
    setSelectedInterviewId(interview.interviewId);
    setApplicationId(interview.applicationId);
    // Format LocalDateTime string to matches datetime-local input (YYYY-MM-DDTHH:MM)
    const dt = new Date(interview.scheduledTime);
    const tzoffset = dt.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(dt.getTime() - tzoffset)).toISOString().slice(0, 16);
    setScheduledTime(localISOTime);
    setDurationMinutes(interview.durationMinutes);
    setRoundName(interview.roundName);
    setLocationOrLink(interview.locationOrLink || '');
    setNotes(interview.notes || '');
    setOpenDialog(true);
  };

  const handleEventClick = (info: any) => {
    const interview = info.event.extendedProps as Interview;
    setViewingInterview(interview);
    setViewDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId || !scheduledTime || !roundName) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload = {
        applicationId,
        scheduledTime,
        durationMinutes,
        roundName,
        locationOrLink,
        notes,
      };

      if (isEdit && selectedInterviewId) {
        await api.put(`/api/interviews/${selectedInterviewId}`, payload);
        setSuccess('Interview rescheduled successfully. Calendar invite dispatched.');
      } else {
        await api.post('/api/interviews', payload);
        setSuccess('Interview scheduled successfully. ICS Calendar invite emailed.');
      }

      setOpenDialog(false);
      fetchInterviews();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError('Failed to schedule interview round.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;

    try {
      setError(null);
      setSuccess(null);
      await api.delete(`/api/interviews/${id}`);
      setSuccess('Interview canceled successfully.');
      setViewDialog(false);
      fetchInterviews();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError('Failed to cancel the interview.');
    }
  };

  // Drag-and-drop to reschedule an event
  const handleEventDrop = async (dropInfo: any) => {
    const interview = dropInfo.event.extendedProps as Interview;
    const newStart = dropInfo.event.start;
    if (!newStart) return;

    try {
      setError(null);
      setSuccess(null);
      
      const tzoffset = newStart.getTimezoneOffset() * 60000;
      const formattedTime = (new Date(newStart.getTime() - tzoffset)).toISOString().slice(0, 16);

      const payload = {
        applicationId: interview.applicationId,
        scheduledTime: formattedTime,
        durationMinutes: interview.durationMinutes,
        roundName: interview.roundName,
        locationOrLink: interview.locationOrLink,
        notes: interview.notes,
      };

      await api.put(`/api/interviews/${interview.interviewId}`, payload);
      setSuccess(`Successfully rescheduled ${interview.companyName} round to ${newStart.toLocaleString()}`);
      fetchInterviews();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError('Failed to reschedule interview.');
      dropInfo.revert();
    }
  };

  // Convert to FullCalendar format
  const calendarEvents = interviews.map((item) => {
    const start = new Date(item.scheduledTime);
    const end = new Date(start.getTime() + item.durationMinutes * 60000);
    return {
      id: item.interviewId.toString(),
      title: `${item.studentName} (${item.companyName})`,
      start: start,
      end: end,
      extendedProps: item,
      color: item.roundName.toLowerCase().includes('hr') ? '#e91e63' :
             item.roundName.toLowerCase().includes('tech') ? '#00bcd4' : '#4caf50',
    };
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Interview Scheduler & Panel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Schedule candidate placement interviews, update timings, and dispatch automated calendar invitations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
          sx={{ fontWeight: 'bold', borderRadius: 2.5, px: 3, py: 1.2 }}
        >
          Schedule Interview
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Card sx={{ p: 2, borderRadius: 3 }}>
        <CardContent>
          {loading && interviews.length === 0 ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              eventClick={handleEventClick}
              editable={true}
              eventDrop={handleEventDrop}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek',
              }}
              height="70vh"
            />
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonth color="primary" /> Interview Brief
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {viewingInterview && (
            <>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {viewingInterview.companyName} &bull; {viewingInterview.roundName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {viewingInterview.companyRole}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <People sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">
                  Student: <strong>{viewingInterview.studentName}</strong> ({viewingInterview.studentEmail})
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">
                  Time: {new Date(viewingInterview.scheduledTime).toLocaleString()} ({viewingInterview.durationMinutes} mins)
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                {viewingInterview.locationOrLink?.startsWith('http') ? (
                  <>
                    <Link sx={{ color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      component="a" 
                      href={viewingInterview.locationOrLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main', textDecoration: 'underline' }}
                    >
                      Join Interview Meeting
                    </Typography>
                  </>
                ) : (
                  <>
                    <Room sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Location: {viewingInterview.locationOrLink || 'To be announced'}
                    </Typography>
                  </>
                )}
              </Box>

              {viewingInterview.notes && (
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <Note sx={{ mt: 0.2, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    Notes: {viewingInterview.notes}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {viewingInterview && (
            <>
              <Button 
                onClick={() => handleDelete(viewingInterview.interviewId)} 
                color="error"
              >
                Cancel Round
              </Button>
              <Button 
                onClick={() => {
                  setViewDialog(false);
                  handleOpenEdit(viewingInterview);
                }} 
                variant="outlined"
              >
                Reschedule
              </Button>
            </>
          )}
          <Button onClick={() => setViewDialog(false)} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {isEdit ? 'Reschedule Interview Round' : 'Schedule New Placement Interview'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3} mt={1}>
            <FormControl fullWidth disabled={isEdit}>
              <InputLabel>Select Candidate Application</InputLabel>
              <Select
                value={applicationId}
                label="Select Candidate Application"
                required
                onChange={(e) => setApplicationId(e.target.value as number)}
              >
                {applications.map((app) => (
                  <MenuItem key={app.applicationId} value={app.applicationId}>
                    {app.studentName} &bull; {app.companyName} ({app.companyRole})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Interview Start Date & Time"
              type="datetime-local"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  required
                  fullWidth
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Interview Round</InputLabel>
                  <Select
                    value={roundName}
                    label="Interview Round"
                    onChange={(e) => setRoundName(e.target.value)}
                  >
                    <MenuItem value="Aptitude Test">Aptitude Test</MenuItem>
                    <MenuItem value="Technical Round 1">Technical Round 1</MenuItem>
                    <MenuItem value="Technical Round 2">Technical Round 2</MenuItem>
                    <MenuItem value="System Design Round">System Design Round</MenuItem>
                    <MenuItem value="HR Discussion">HR Discussion</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Meeting Link (Zoom, Meet, Teams) or Office Room"
              fullWidth
              placeholder="e.g. https://meet.google.com/abc-defg-hij"
              value={locationOrLink}
              onChange={(e) => setLocationOrLink(e.target.value)}
            />

            <TextField
              label="Instructions / Notes for Candidate"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting || !applicationId || !scheduledTime}
          >
            {isEdit ? 'Save Changes' : 'Schedule Round'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageInterviews;
