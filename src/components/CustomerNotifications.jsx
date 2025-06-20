import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';

const CustomerNotifications = () => {
  const { currentCustomer } = useAuth();
  const [completedEvents, setCompletedEvents] = useState([]);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentCustomer) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const allVendors = vendorManager.getAllData();
      const myCompletedEvents = [];
      Object.entries(allVendors).forEach(([vendorId, vendorData]) => {
        if (vendorData.confirmations && Array.isArray(vendorData.confirmations)) {
          vendorData.confirmations.forEach(conf => {
            if (
              conf.customerId === currentCustomer.id &&
              !conf.eventId.startsWith('SERVICE_ONLY_') &&
              (conf.status === 'Completed' || conf.status === 'completed') &&
              !conf.feedback // Only show if feedback not given
            ) {
              // Find the event details
              const event = (vendorData.events || []).find(e => e.id === conf.eventId);
              if (event) {
                myCompletedEvents.push({
                  ...event,
                  vendorId,
                  vendorName: vendorData.profile?.businessName || 'Unknown Vendor',
                  confirmedAt: conf.timestamp,
                  status: conf.status || 'Completed',
                  confObj: conf,
                  confirmationId: conf.confirmationId,
                });
              }
            }
          });
        }
      });
      setCompletedEvents(myCompletedEvents.sort((a, b) => new Date(b.confirmedAt) - new Date(a.confirmedAt)));
    } catch (err) {
      console.error('Error in useEffect: ', err.message);
    }
    setLoading(false);
  }, [currentCustomer]);

  const handleOpenFeedback = (event) => {
    setSelectedEvent(event);
    setRating(0);
    setFeedback('');
    setFeedbackDialogOpen(true);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleCloseFeedback = () => {
    setFeedbackDialogOpen(false);
    setSelectedEvent(null);
    setRating(0);
    setFeedback('');
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmitFeedback = () => {
    if (!rating || !feedback.trim()) {
      setErrorMsg('Please provide both a rating and feedback.');
      return;
    }
    // Save feedback in the vendor's confirmation object
    const allVendors = vendorManager.getAllData();
    const vendorData = allVendors[selectedEvent.vendorId];
    if (vendorData && vendorData.confirmations) {
      const confIndex = vendorData.confirmations.findIndex(
        conf => conf.confirmationId === selectedEvent.confirmationId
      );
      if (confIndex !== -1) {
        vendorData.confirmations[confIndex].feedback = {
          rating,
          text: feedback,
          submittedAt: new Date().toISOString(),
        };
        vendorManager.saveAllData(allVendors);
        setSuccessMsg('Thank you for your feedback!');
        setCompletedEvents(prev => prev.filter(e => e.confirmationId !== selectedEvent.confirmationId));
        setTimeout(() => {
          handleCloseFeedback();
        }, 1200);
        return;
      }
    }
    setErrorMsg('Failed to submit feedback. Please try again.');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', p: 3 }}>
      <Button variant="contained" sx={{ mb: 3 }} onClick={() => navigate('/customer-dashboard')}>
        Back to Dashboard
      </Button>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#2c3e50', fontWeight: 700, mb: 4 }}>
        Notifications
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '800px', width: '100%' }}>
        {!currentCustomer ? (
          <Typography align="center" color="error">No customer is logged in. Please log in to view notifications.</Typography>
        ) : loading ? (
          <Typography align="center" sx={{ mt: 2 }}>Loading notifications...</Typography>
        ) : completedEvents.length > 0 ? (
          <List>
            {completedEvents.map((event, idx) => (
              <React.Fragment key={event.id}>
                <ListItem alignItems="flex-start" secondaryAction={
                  <Button variant="outlined" onClick={() => handleOpenFeedback(event)}>
                    Submit Feedback
                  </Button>
                }>
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="h6">{event.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Vendor: {event.vendorName}
                        </Typography>
                      </>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">{event.description}</Typography>
                        {event.date && (
                          <Typography variant="caption" color="text.secondary">
                            Event Date: {event.date}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Confirmed on: {new Date(event.confirmedAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {idx < completedEvents.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography align="center" sx={{ mt: 2 }}>
            No completed events pending feedback.
          </Typography>
        )}
      </Paper>
      <Dialog open={feedbackDialogOpen} onClose={handleCloseFeedback}>
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
          <Typography gutterBottom>How would you rate your experience?</Typography>
          <Rating
            name="event-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
          />
          <TextField
            label="Your Feedback"
            multiline
            minRows={3}
            fullWidth
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitFeedback} disabled={!!successMsg}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerNotifications; 