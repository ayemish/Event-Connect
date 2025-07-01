import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';

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
    <>
      <CustomerHeader />
      <Box sx={{ minHeight: '100vh', bgcolor: '#333446', p: 3, fontFamily: 'Inter, sans-serif' }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{
            color: '#EAEFEF',
            fontWeight: 700,
            mb: 4,
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Notifications
        </Typography>
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            mx: 'auto', 
            maxWidth: '900px', 
            width: '100%',
            bgcolor: '#23243a',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}
        >
          {!currentCustomer ? (
            <Typography align="center" color="error">No customer is logged in. Please log in to view notifications.</Typography>
          ) : loading ? (
            <Typography align="center" sx={{ mt: 2, color: '#B8CFCE' }}>Loading notifications...</Typography>
          ) : completedEvents.length > 0 ? (
            <List sx={{ p: 0 }}>
              {completedEvents.map((event, idx) => (
                <React.Fragment key={event.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{
                      bgcolor: '#333446',
                      borderRadius: 2,
                      mb: 2,
                      p: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#EAEFEF', 
                              fontWeight: 600,
                              mb: 1,
                              fontFamily: 'Playfair Display, serif'
                            }}
                          >
                            {event.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#B8CFCE', 
                              mb: 1,
                              fontWeight: 500
                            }}
                          >
                            Vendor: {event.vendorName}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 2 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#B8CFCE', 
                              mb: 1,
                              lineHeight: 1.6
                            }}
                          >
                            {event.description}
                          </Typography>
                          {event.date && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#EAEFEF', 
                                display: 'block',
                                mb: 0.5,
                                fontWeight: 500
                              }}
                            >
                              Event Date: {event.date}
                            </Typography>
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#B8CFCE', 
                              display: 'block',
                              fontWeight: 400
                            }}
                          >
                            Confirmed on: {new Date(event.confirmedAt).toLocaleString()}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            sx={{
                              borderColor: '#B8CFCE',
                              color: '#B8CFCE',
                              fontWeight: 600,
                              px: 2,
                              py: 1,
                              borderRadius: 2,
                              mt: 2,
                              '&:hover': {
                                borderColor: '#EAEFEF',
                                bgcolor: '#7F8CAA',
                                color: '#EAEFEF'
                              }
                            }}
                            onClick={() => handleOpenFeedback(event)}
                          >
                            Submit Feedback
                          </Button>
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#EAEFEF',
                  fontFamily: 'Playfair Display, serif',
                  mb: 2
                }}
              >
                No completed events pending feedback.
              </Typography>
            </Box>
          )}
        </Paper>
        <Dialog 
          open={feedbackDialogOpen} 
          onClose={handleCloseFeedback}
          PaperProps={{
            sx: {
              bgcolor: '#23243a',
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ color: '#EAEFEF', fontFamily: 'Playfair Display, serif' }}>Submit Feedback</DialogTitle>
          <DialogContent>
            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <Typography gutterBottom sx={{ color: '#B8CFCE' }}>How would you rate your experience?</Typography>
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
              sx={{ mt: 2, bgcolor: '#333446', color: '#EAEFEF', borderRadius: 2, '& .MuiInputBase-input': { color: '#EAEFEF' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#B8CFCE' }, '&:hover fieldset': { borderColor: '#EAEFEF' }, '&.Mui-focused fieldset': { borderColor: '#B8CFCE' } } }}
              InputLabelProps={{ sx: { color: '#B8CFCE' } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFeedback} sx={{ color: '#B8CFCE', '&:hover': { bgcolor: '#333446', color: '#EAEFEF' } }}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitFeedback} disabled={!!successMsg} sx={{ bgcolor: '#B8CFCE', color: '#333446', fontWeight: 600, '&:hover': { bgcolor: '#EAEFEF' } }}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default CustomerNotifications; 