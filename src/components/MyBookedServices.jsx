import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ThirdPartyServices/ServiceCard';
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

const MyBookedServices = () => {
  const { currentCustomer } = useAuth();
  const [bookedServices, setBookedServices] = useState([]);
  const navigate = useNavigate();
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payingService, setPayingService] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('cash');

  useEffect(() => {
    if (!currentCustomer) return;
    const allVendors = vendorManager.getAllData();
    const myServices = [];
    Object.entries(allVendors).forEach(([vendorId, vendorData]) => {
      if (vendorData.confirmations && Array.isArray(vendorData.confirmations)) {
        vendorData.confirmations.forEach(conf => {
          if (
            conf.customerId === currentCustomer.id &&
            conf.eventId.startsWith('SERVICE_ONLY_') &&
            conf.selectedServices && conf.selectedServices.length > 0
          ) {
            // Find the service details
            const serviceId = conf.selectedServices[0];
            const service = (vendorData.services || []).find(s => s.id === serviceId);
            if (service) {
              myServices.push({
                ...service,
                vendorName: vendorData.profile?.businessName || 'Unknown Vendor',
                bookedAt: conf.timestamp,
                status: conf.status || 'Pending',
                bookingDate: conf.date,
                paymentStatus: conf.paymentStatus || 'Pending',
                paymentMethod: conf.paymentMethod,
                confirmationId: conf.confirmationId,
                vendorId,
              });
            }
          }
        });
      }
    });
    setBookedServices(myServices.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
  }, [currentCustomer, JSON.stringify(vendorManager.getAllData())]);

  const handlePayNow = (vendorId, confirmationId) => {
    setPayingService({ vendorId, confirmationId });
    setPayDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    if (payingService) {
      const allData = vendorManager.getAllData();
      const { vendorId, confirmationId } = payingService;
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
    setPayingService(null);
    setSelectedMethod('cash');
    window.location.reload();
  };

  const handleCancelPayment = () => {
    setPayDialogOpen(false);
    setPayingService(null);
    setSelectedMethod('cash');
  };

  const handleSkipPayment = () => {
    if (payingService) {
      const allData = vendorManager.getAllData();
      const { vendorId, confirmationId } = payingService;
      if (allData[vendorId] && allData[vendorId].confirmations) {
        const confIndex = allData[vendorId].confirmations.findIndex(
          conf => conf.confirmationId === confirmationId
        );
        if (confIndex !== -1) {
          allData[vendorId].confirmations[confIndex].paymentStatus = 'Pending';
          allData[vendorId].confirmations[confIndex].paymentMethod = selectedMethod;
          vendorManager.saveAllData(allData);
        }
      }
    }
    setPayDialogOpen(false);
    setPayingService(null);
    setSelectedMethod('cash');
    window.location.reload();
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
          My Services
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
          {bookedServices.length > 0 ? (
            <List sx={{ p: 0 }}>
              {bookedServices.map((service, idx) => (
                <React.Fragment key={service.id + service.bookedAt}>
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
                            {service.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#B8CFCE', 
                              mb: 1,
                              fontWeight: 500
                            }}
                          >
                            Vendor: {service.vendorName}
                          </Typography>
                          <Chip
                            label={service.status}
                            color={statusColors[service.status] || 'default'}
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.9rem', 
                              px: 2, 
                              py: 1,
                              bgcolor: service.status === 'Completed' ? '#4caf50' : 
                                       service.status === 'Ongoing' ? '#ff9800' :
                                       service.status === 'Booked' ? '#2196f3' : '#9e9e9e',
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
                            {service.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600, mr: 1 }}>
                              Payment:
                            </Typography>
                            <Chip
                              label={service.paymentStatus === 'Clear' ? 'Paid' : 'Pending Payment'}
                              color={service.paymentStatus === 'Clear' ? 'success' : 'warning'}
                              sx={{ ml: 0, fontWeight: 600, fontSize: '0.9rem', bgcolor: service.paymentStatus === 'Clear' ? '#4caf50' : '#ff9800', color: '#EAEFEF' }}
                            />
                            {service.paymentStatus === 'Clear' && service.paymentMethod && (
                              <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 500, ml: 2 }}>
                                (Method: {service.paymentMethod.charAt(0).toUpperCase() + service.paymentMethod.slice(1)})
                              </Typography>
                            )}
                            {service.paymentStatus !== 'Clear' && (
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{ ml: 2, fontWeight: 700, bgcolor: '#7F8CAA', color: '#EAEFEF' }}
                                onClick={() => handlePayNow(service.vendorId, service.confirmationId)}
                              >
                                Pay Now
                              </Button>
                            )}
                          </Box>
                          {service.bookingDate && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#EAEFEF', 
                                display: 'block',
                                mb: 0.5,
                                fontWeight: 500
                              }}
                            >
                              Service Date: {service.bookingDate}
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
                            Booked on: {new Date(service.bookedAt).toLocaleString()}
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
                No Booked Services
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#B8CFCE',
                  mb: 3
                }}
              >
                You have not booked any services yet.
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
                Browse Services
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
          <Button onClick={handleSkipPayment}>Skip Payment</Button>
          <Button onClick={handleConfirmPayment} variant="contained">Confirm Payment</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyBookedServices; 