import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, TextField, Alert, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { vendorManager } from '../utils/vendorUtils';
import { useAuth } from '../context/AuthContext';

const BookServiceOnly = () => {
  const navigate = useNavigate();
  const { currentCustomer } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Gather all available services from all vendors
    const allVendors = vendorManager.getAllData();
    const allServices = [];
    Object.entries(allVendors).forEach(([vendorId, vendorData]) => {
      if (vendorData.services && Array.isArray(vendorData.services)) {
        vendorData.services.forEach(service => {
          allServices.push({ ...service, vendorId });
        });
      }
    });
    setServices(allServices);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setWarning('');
    setSuccess('');
    if (!selectedServiceId) {
      setWarning('Please select a service.');
      return;
    }
    if (!selectedDate) {
      setWarning('Please select a date for your service.');
      return;
    }
    const service = services.find(s => s.id === selectedServiceId);
    if (!service) {
      setWarning('Service not found.');
      return;
    }
    // Save as a service-only confirmation (eventId = 'SERVICE_ONLY_' + service.id)
    const vendorId = service.vendorId;
    const eventId = 'SERVICE_ONLY_' + service.id;
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
        setWarning('This service is already booked for the selected date. Please choose another date.');
        return;
      }
    }
    vendorManager.addEventConfirmation(vendorId, eventId, customerId, customerName, selectedDate, '', [service.id]);
    setSuccess('Service booked successfully!');
    setTimeout(() => navigate('/my-events'), 1200);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 600, width: '100%', mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Book a Service Only
        </Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select a Service:
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {services.length > 0 ? (
              services.map(service => (
                <Grid item xs={12} key={service.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedServiceId === service.id}
                        onChange={() => setSelectedServiceId(service.id)}
                        name={service.name}
                      />
                    }
                    label={<span><b>{service.name}</b>  <br /> <span style={{ color: '#888' }}>{service.price}</span></span>}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}><Typography color="text.secondary">No services available.</Typography></Grid>
            )}
          </Grid>
          <TextField
            type="date"
            label="Service Date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: false }}
            fullWidth
            sx={{ mb: 3 }}
          />
          {warning && <Alert severity="warning" sx={{ mb: 2 }}>{warning}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Book Service
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default BookServiceOnly; 