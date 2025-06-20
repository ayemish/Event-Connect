import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, MenuItem, Select, FormControl, InputLabel, Card } from '@mui/material';
import { getCurrentVendor, vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Rating from '@mui/material/Rating';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentVendor = getCurrentVendor();
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [debugConfirmations, setDebugConfirmations] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [unreadIds, setUnreadIds] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentVendor || !currentVendor.id) {
          console.error('No current vendor found');
          setError('No vendor session found');
          return;
        }

        console.log('Fetching notifications for vendor:', currentVendor.id);
        const vendorConfirmations = vendorManager.getVendorConfirmations(currentVendor.id);
        setDebugConfirmations(vendorConfirmations); // For debug panel
        console.log('Vendor confirmations:', vendorConfirmations);

        const vendorEvents = vendorManager.getVendorContent(currentVendor.id)?.events || [];
        console.log('Vendor events:', vendorEvents);

        if (!vendorConfirmations || vendorConfirmations.length === 0) {
          console.log('No confirmations found');
          setNotifications([]);
          return;
        }

        const detailedNotifications = vendorConfirmations.map((conf) => {
          try {
            const event = vendorEvents.find(e => e.id === conf.eventId);
            let status = conf.status || 'Booked'; // Default to Booked if not set
            if (!conf.status && event && event.date) {
              const now = new Date();
              const eventDate = new Date(event.date);
              status = eventDate >= now.setHours(0,0,0,0) ? 'Ongoing' : 'Completed';
            }
            return {
              ...conf,
              eventName: event ? event.name : 'Unknown Event',
              eventDescription: event ? event.description : 'N/A',
              customerName: conf.customerName || conf.customerId,
              status
            };
          } catch (err) {
            console.error('Error processing confirmation:', err);
            return {
              ...conf,
              eventName: 'Unknown Event',
              eventDescription: 'N/A',
              customerName: conf.customerName || conf.customerId,
              status: conf.status || 'Booked'
            };
          }
        });

        // Sort notifications by timestamp descending (newest first)
        detailedNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setNotifications(detailedNotifications);

        // Track unread notifications
        const readIds = JSON.parse(localStorage.getItem('vendor_read_confirmations') || '[]');
        const currentIds = detailedNotifications.map(n => n.confirmationId);
        const newUnread = currentIds.filter(id => !readIds.includes(id));
        setUnreadIds(newUnread);
        setShowSnackbar(newUnread.length > 0);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentVendor?.id]);

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    // Mark all current notifications as read
    const readIds = JSON.parse(localStorage.getItem('vendor_read_confirmations') || '[]');
    const allIds = notifications.map(n => n.confirmationId);
    const updatedRead = Array.from(new Set([...readIds, ...allIds]));
    localStorage.setItem('vendor_read_confirmations', JSON.stringify(updatedRead));
    setUnreadIds([]);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        p: 3,
        alignItems: 'center',
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        variant="contained"
        sx={{
          mb: 3,
          bgcolor: '#2c3e50',
          '&:hover': {
            bgcolor: '#34495e'
          }
        }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Event Bookings
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '800px', width: '100%' }}>
        {loading ? (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Loading notifications...
          </Typography>
        ) : error ? (
          <Typography variant="body1" align="center" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : notifications.length > 0 ? (
          <List>
            {notifications.map((notification, index) => (
              <Card key={notification.confirmationId} elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: '#fff', cursor: 'pointer' }}
                onClick={() => navigate(`/event-confirmation/${notification.eventId}/${notification.customerId}/${notification.date}`)}
              >
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Event: ${notification.eventName}`}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Customer: {notification.customerName}
                        </Typography>
                        {` — ${notification.eventDescription}`}
                        <br/>
                        <FormControl size="small" sx={{ mt: 1, minWidth: 120 }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={typeof notification.status === 'string' ? notification.status : 'Booked'}
                            label="Status"
                            onChange={e => {
                              const newStatus = e.target.value;
                              vendorManager.updateConfirmationStatus(
                                currentVendor.id,
                                notification.confirmationId,
                                newStatus
                              );
                              setNotifications(prev => prev.map(n =>
                                n.confirmationId === notification.confirmationId
                                  ? { ...n, status: newStatus }
                                  : n
                              ));
                            }}
                            onClick={e => e.stopPropagation()}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Booked">Booked</MenuItem>
                            <MenuItem value="Ongoing">Ongoing</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                          </Select>
                        </FormControl>
                        <br/>
                        <Typography variant="caption" color="text.secondary">
                          Confirmed on: {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                        {notification.date && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            Event Date: {notification.date}
                          </Typography>
                        )}
                        {notification.feedback && (
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, ml: 1 }}
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedFeedback({
                                ...notification,
                                feedback: notification.feedback
                              });
                              setFeedbackDialogOpen(true);
                            }}
                          >
                            View Feedback
                          </Button>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider component="li" />}
              </Card>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            No new event confirmations at the moment.
          </Typography>
        )}
      </Paper>
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)}>
        <DialogTitle>Customer Feedback</DialogTitle>
        <DialogContent>
          {selectedFeedback && selectedFeedback.feedback && (
            <Box sx={{ minWidth: 300 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Event: {selectedFeedback.eventName}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Customer: {selectedFeedback.customerName}
              </Typography>
              <Rating value={selectedFeedback.feedback.rating} readOnly sx={{ mb: 1 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                {selectedFeedback.feedback.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedFeedback.feedback.submittedAt ? `Submitted: ${new Date(selectedFeedback.feedback.submittedAt).toLocaleString()}` : ''}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          You have new event bookings!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Notifications; 