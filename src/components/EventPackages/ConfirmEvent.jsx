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
    // Save confirmation with invitees and selected services
    vendorManager.addEventConfirmation(vendorId, eventId, customerId, customerName, selectedDate, invitees, selectedServices);
    setSuccess('Event confirmed successfully!');
    setTimeout(() => navigate('/my-events'), 1200);
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 500, width: '100%', mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Confirm Event: {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="date"
            label="Event Date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: false }}
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Invitation List (comma separated)"
            value={invitees}
            onChange={e => setInvitees(e.target.value)}
            placeholder="e.g. alice@example.com, bob@example.com"
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 3 }}
          />
          <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
            Select Customization Services:
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {availableServices.length > 0 ? (
              availableServices.map(service => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                        />
                      }
                      label={<span><b>{service.name}</b> <br /> <span style={{ color: '#888' }}>{service.price}</span></span>}
                    />
                    <Button size="small" sx={{ mt: 1 }} onClick={() => setOpenService(service)}>
                      View Details
                    </Button>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}><Typography color="text.secondary">No services available.</Typography></Grid>
            )}
          </Grid>
          {/* Service Details Dialog */}
          <Dialog open={!!openService} onClose={() => setOpenService(null)} maxWidth="md" fullWidth>
            <DialogTitle>
              Service Details
              <IconButton
                aria-label="close"
                onClick={() => setOpenService(null)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {openService && (
                <Box>
                  <Card>
                    <CardMedia
                      component="img"
                      height="300"
                      image={openService.image || 'https://via.placeholder.com/400'}
                      alt={openService.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                  <Typography variant="h5" sx={{ mt: 2 }}>{openService.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    Price: {openService.price}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" paragraph>
                    {openService.description}
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </Dialog>
          {warning && <Alert severity="warning" sx={{ mb: 2 }}>{warning}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" type="submit">
              Confirm Event
            </Button>
            <Button variant="outlined" onClick={() => navigate('/customer-dashboard')}>Cancel</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ConfirmEvent; 