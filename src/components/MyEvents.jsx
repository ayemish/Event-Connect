import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const statusColors = {
  Pending: 'default',
  Booked: 'info',
  Ongoing: 'warning',
  Completed: 'success',
};

const MyEvents = () => {
  const { currentCustomer } = useAuth();
  const [confirmedEvents, setConfirmedEvents] = useState([]);
  const navigate = useNavigate();
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payingEvent, setPayingEvent] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('cash');

  useEffect(() => {
    if (!currentCustomer) return;
    const allVendors = vendorManager.getAllData();
    const myEvents = [];
    Object.entries(allVendors).forEach(([vendorId, vendorData]) => {
      if (vendorData.confirmations && Array.isArray(vendorData.confirmations)) {
        vendorData.confirmations.forEach(conf => {
          if (conf.customerId === currentCustomer.id && !conf.eventId.startsWith('SERVICE_ONLY_')) {
            // Find the event details
            const event = (vendorData.events || []).find(e => e.id === conf.eventId);
            if (event) {
              myEvents.push({
                ...event,
                vendorName: vendorData.profile?.businessName || 'Unknown Vendor',
                confirmedAt: conf.timestamp,
                status: conf.status || 'Pending',
                paymentStatus: conf.paymentStatus || 'Pending',
                confirmationId: conf.confirmationId,
                vendorId,
              });
            }
          }
        });
      }
    });
    setConfirmedEvents(myEvents.sort((a, b) => new Date(b.confirmedAt) - new Date(a.confirmedAt)));
  }, [currentCustomer]);

  const handlePayNow = (vendorId, confirmationId) => {
    setPayingEvent({ vendorId, confirmationId });
    setPayDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    if (payingEvent) {
      // Update payment status and method
      const allData = vendorManager.getAllData();
      const { vendorId, confirmationId } = payingEvent;
      if (allData[vendorId] && allData[vendorId].confirmations) {
        const confIndex = allData[vendorId].confirmations.findIndex(
          conf => conf.confirmationId === confirmationId
        );
        if (confIndex !== -1) {
          allData[vendorId].confirmations[confIndex].paymentStatus = 'Clear';
          allData[vendorId].confirmations[confIndex].paymentTimestamp = new Date().toISOString();
          allData[vendorId].confirmations[confIndex].paymentMethod = selectedMethod;
          vendorManager.saveAllData(allData);
        }
      }
    }
    setPayDialogOpen(false);
    setPayingEvent(null);
    setSelectedMethod('cash');
    window.location.reload();
  };

  const handleCancelPayment = () => {
    setPayDialogOpen(false);
    setPayingEvent(null);
    setSelectedMethod('cash');
  };

  return (
    <>
      <CustomerHeader />
      <Box sx={{ minHeight: '100vh', height: 'auto', bgcolor: '#333446', p: 0 }}>
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
          My Events
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
          {confirmedEvents.length > 0 ? (
            <List sx={{ p: 0 }}>
              {confirmedEvents.map((event, idx) => (
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
                          <Chip
                            label={event.status}
                            color={statusColors[event.status] || 'default'}
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.9rem', 
                              px: 2, 
                              py: 1,
                              bgcolor: event.status === 'Completed' ? '#4caf50' : 
                                       event.status === 'Ongoing' ? '#ff9800' :
                                       event.status === 'Booked' ? '#2196f3' : '#9e9e9e',
                              color: '#EAEFEF',
                              '& .MuiChip-label': {
                                color: '#EAEFEF'
                              }
                            }}
                          />
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
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600, mr: 1 }}>
                              Payment:
                            </Typography>
                            <Chip
                              label={event.paymentStatus === 'Clear' ? 'Paid' : 'Pending Payment'}
                              color={event.paymentStatus === 'Clear' ? 'success' : 'warning'}
                              sx={{ ml: 0, fontWeight: 600, fontSize: '0.9rem', bgcolor: event.paymentStatus === 'Clear' ? '#4caf50' : '#ff9800', color: '#EAEFEF' }}
                            />
                            {event.paymentStatus === 'Clear' && event.paymentMethod && (
                              <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 500, ml: 2 }}>
                                (Method: {event.paymentMethod.charAt(0).toUpperCase() + event.paymentMethod.slice(1)})
                              </Typography>
                            )}
                            {event.paymentStatus !== 'Clear' && (
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{ ml: 2, fontWeight: 700, bgcolor: '#7F8CAA', color: '#EAEFEF' }}
                                onClick={() => handlePayNow(event.vendorId, event.confirmationId)}
                              >
                                Pay Now
                              </Button>
                            )}
                          </Box>
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
                No Confirmed Events
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#B8CFCE',
                  mb: 3
                }}
              >
                You have not confirmed any events yet.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/customer-dashboard')}
                sx={{
                  bgcolor: '#B8CFCE',
                  color: '#333446',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#EAEFEF'
                  }
                }}
              >
                Browse Events
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
      <Dialog open={payDialogOpen} onClose={handleCancelPayment}>
        <DialogTitle>Select Payment Method</DialogTitle>
        <DialogContent>
          <RadioGroup
            value={selectedMethod}
            onChange={e => setSelectedMethod(e.target.value)}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            <FormControlLabel value="online" control={<Radio />} label="Online" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPayment}>Cancel</Button>
          <Button onClick={handleConfirmPayment} variant="contained">Confirm Payment</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyEvents; 