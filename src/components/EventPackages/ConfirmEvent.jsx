import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, Alert, Chip, Stack, Checkbox, FormControlLabel, Grid, Card, CardMedia, Divider } from '@mui/material';
import { vendorManager } from '../../utils/vendorUtils';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from '../ThirdPartyServices/ServiceCard';
import ServiceDetails from '../ThirdPartyServices/ServiceDetails';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

const ConfirmEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentCustomer } = useAuth();
  const [event, setEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [invitees, setInvitees] = useState('');
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [openService, setOpenService] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [lastConfirmationId, setLastConfirmationId] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  useEffect(() => {
    // Find the event from all vendors
    const allVendors = vendorManager.getAllData();
    let foundEvent = null;
    let foundVendorId = null;
    Object.entries(allVendors).forEach(([vendorId, vendorData]) => {
      if (vendorData.events) {
        const e = vendorData.events.find(ev => ev.id === eventId);
        if (e) {
          foundEvent = { ...e, vendorId };
          foundVendorId = vendorId;
        }
      }
    });
    setEvent(foundEvent);
    // Gather all available services from all vendors
    const allServices = [];
    Object.values(allVendors).forEach(vendorData => {
      if (vendorData.services && Array.isArray(vendorData.services)) {
        allServices.push(...vendorData.services);
      }
    });
    setAvailableServices(allServices);
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setWarning('');
    setSuccess('');
    if (!selectedDate) {
      setWarning('Please select a date for your event.');
      return;
    }
    if (!event) {
      setWarning('Event not found.');
      return;
    }
    const vendorId = event.vendorId;
    const customerId = currentCustomer?.id || 'anonymous_customer';
    const customerName = currentCustomer?.name || 'Anonymous Customer';
    // Check for duplicate booking on the same date (by any customer)
    const allData = vendorManager.getAllData();
    const vendorData = allData[vendorId];
    if (vendorData && vendorData.confirmations) {
      const alreadyBooked = vendorData.confirmations.some(
        conf => conf.eventId === eventId && conf.date === selectedDate
      );
      if (alreadyBooked) {
        setWarning('This event is already booked for the selected date. Please choose another date.');
        return;
      }
    }
    // Calculate customization details
    let isCustomized = false;
    let customizationDetails = [];
    let additionalCost = 0;
    let totalCost = Number(event.price) || 0;
    if (selectedServices && selectedServices.length > 0) {
      isCustomized = true;
      customizationDetails = availableServices.filter(s => selectedServices.includes(s.id)).map(s => ({ id: s.id, name: s.name, price: Number(s.price) || 0 }));
      additionalCost = customizationDetails.reduce((sum, s) => sum + s.price, 0);
      totalCost += additionalCost;
    }
    // Save the info for later, open payment dialog
    setPendingConfirmation({
      vendorId,
      eventId,
      customerId,
      customerName,
      selectedDate,
      invitees,
      selectedServices,
      customizationInfo: { isCustomized, customizationDetails, additionalCost, totalCost }
    });
    setPaymentDialogOpen(true);
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handlePaymentConfirm = () => {
    if (!pendingConfirmation) return;
    const { vendorId, eventId, customerId, customerName, selectedDate, invitees, selectedServices, customizationInfo } = pendingConfirmation;
    vendorManager.addEventConfirmation(
      vendorId,
      eventId,
      customerId,
      customerName,
      selectedDate,
      invitees,
      selectedServices,
      {
        ...customizationInfo,
        paymentStatus: 'Clear',
        paymentMethod: selectedPaymentMethod,
        paymentTimestamp: new Date().toISOString()
      }
    );
    setPaymentDialogOpen(false);
    setSuccess('Event confirmed and payment recorded!');
    setTimeout(() => navigate('/my-events'), 800);
  };

  const handlePaymentSkip = () => {
    if (!pendingConfirmation) return;
    const { vendorId, eventId, customerId, customerName, selectedDate, invitees, selectedServices, customizationInfo } = pendingConfirmation;
    vendorManager.addEventConfirmation(
      vendorId,
      eventId,
      customerId,
      customerName,
      selectedDate,
      invitees,
      selectedServices,
      {
        ...customizationInfo,
        paymentStatus: 'Pending',
        paymentMethod: selectedPaymentMethod
      }
    );
    setPaymentDialogOpen(false);
    setSuccess('Event confirmed! You can pay later from My Events.');
    setTimeout(() => navigate('/my-events'), 800);
  };

  if (!event) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Event not found</Typography>
        <Button onClick={() => navigate('/customer-dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', height: 'auto', bgcolor: '#333446', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
      `}</style>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 540, width: '100%', mt: 6, bgcolor: '#23243a', borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(51,52,70,0.10)' }}>
        <Typography variant="h4" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#EAEFEF', mb: 2, letterSpacing: 1 }}>
          Confirm Event: {event.name}
        </Typography>
        <Typography variant="body1" sx={{ color: '#B8CFCE', mb: 2, fontWeight: 500 }}>
          {event.description}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="date"
            label="Event Date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true, sx: { color: '#B8CFCE' } }}
            InputProps={{ readOnly: false }}
            fullWidth
            sx={{ mb: 3, 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#333446',
                color: '#EAEFEF',
                borderRadius: 2,
                '& fieldset': { borderColor: '#7F8CAA' },
                '&:hover fieldset': { borderColor: '#B8CFCE' },
                '&.Mui-focused fieldset': { borderColor: '#B8CFCE' },
                '& input': { color: '#EAEFEF' }
              },
              '& .MuiInputLabel-root': { color: '#B8CFCE' }
            }}
          />
          <TextField
            label="Invitation List (comma separated)"
            value={invitees}
            onChange={e => setInvitees(e.target.value)}
            placeholder="e.g. alice@example.com, bob@example.com"
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 3, 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#333446',
                color: '#EAEFEF',
                borderRadius: 2,
                '& fieldset': { borderColor: '#7F8CAA' },
                '&:hover fieldset': { borderColor: '#B8CFCE' },
                '&.Mui-focused fieldset': { borderColor: '#B8CFCE' },
                '& textarea': { color: '#EAEFEF' }
              },
              '& .MuiInputLabel-root': { color: '#B8CFCE' }
            }}
          />
          <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', color: '#B8CFCE', mb: 1, mt: 2, fontWeight: 700, fontSize: '1.1rem' }}>
            Select Customization Services:
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {availableServices.length > 0 ? (
              availableServices.map(service => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Box sx={{ border: '1px solid #7F8CAA', bgcolor: '#333446', borderRadius: 2, p: 2, mb: 1, color: '#EAEFEF', boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)', transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 25px rgba(51,52,70,0.3)', borderColor: '#B8CFCE' } }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          sx={{ color: '#B8CFCE', '&.Mui-checked': { color: '#B8CFCE' } }}
                        />
                      }
                      label={<span style={{ color: '#EAEFEF' }}><b>{service.name}</b> <br /> <span style={{ color: '#B8CFCE' }}>{service.price}</span></span>}
                    />
                    <Button size="small" sx={{ mt: 1, bgcolor: '#7F8CAA', color: '#23243a', fontWeight: 600, borderRadius: 2, '&:hover': { bgcolor: '#B8CFCE', color: '#23243a' } }} onClick={() => setOpenService(service)}>
                      View Details
                    </Button>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}><Typography color="#B8CFCE">No services available.</Typography></Grid>
            )}
          </Grid>
          {/* Service Details Dialog */}
          <Dialog open={!!openService} onClose={() => setOpenService(null)} maxWidth="md" fullWidth
            PaperProps={{ sx: { bgcolor: '#23243a', color: '#EAEFEF', borderRadius: 3 } }}>
            <DialogTitle sx={{ bgcolor: '#333446', color: '#EAEFEF', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
              Service Details
              <IconButton
                aria-label="close"
                onClick={() => setOpenService(null)}
                sx={{ position: 'absolute', right: 8, top: 8, color: '#B8CFCE' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ bgcolor: '#23243a' }}>
              {openService && (
                <Box>
                  <Card sx={{ bgcolor: '#333446', borderRadius: 2 }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={openService.image || 'https://via.placeholder.com/400'}
                      alt={openService.name}
                      sx={{ objectFit: 'cover', borderRadius: 2 }}
                    />
                  </Card>
                  <Typography variant="h5" sx={{ mt: 2, color: '#EAEFEF', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>{openService.name}</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#B8CFCE' }}>
                    Price: {openService.price}
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: '#7F8CAA' }} />
                  <Typography variant="body1" paragraph sx={{ color: '#EAEFEF' }}>
                    {openService.description}
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </Dialog>
          {warning && <Alert severity="warning" sx={{ mb: 2 }}>{warning}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              type="submit"
              sx={{
                bgcolor: '#B8CFCE',
                color: '#333446',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.2,
                boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
                '&:hover': { bgcolor: '#EAEFEF', color: '#23243a' }
              }}
            >
              Confirm Event
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/customer-dashboard')}
              sx={{
                color: '#B8CFCE',
                borderColor: '#7F8CAA',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.2,
                '&:hover': { borderColor: '#B8CFCE', color: '#EAEFEF', bgcolor: '#333446' }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Select Payment Method</DialogTitle>
        <DialogContent>
          <RadioGroup
            value={selectedPaymentMethod}
            onChange={e => setSelectedPaymentMethod(e.target.value)}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            <FormControlLabel value="online" control={<Radio />} label="Online" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePaymentSkip}>Skip Payment</Button>
          <Button onClick={handlePaymentConfirm} variant="contained">Confirm Payment</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfirmEvent; 