import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, MenuItem, Select, FormControl, InputLabel, Card } from '@mui/material';
import { getCurrentVendor, vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ServiceBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentVendor = getCurrentVendor();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentVendor || !currentVendor.id) {
          setError('No vendor session found');
          return;
        }

        const vendorConfirmations = vendorManager.getVendorConfirmations(currentVendor.id);
        const vendorServices = vendorManager.getVendorContent(currentVendor.id)?.services || [];

        if (!vendorConfirmations || vendorConfirmations.length === 0) {
          setBookings([]);
          return;
        }

        const detailedBookings = vendorConfirmations
          .filter(conf => conf.eventId.startsWith('SERVICE_ONLY_'))
          .map((conf) => {
            const serviceId = conf.selectedServices && conf.selectedServices[0];
            const service = vendorServices.find(s => s.id === serviceId);
            return {
              ...conf,
              serviceName: service ? service.name : 'Unknown Service',
              serviceDescription: service ? service.description : 'N/A',
              customerName: conf.customerName || conf.customerId,
              status: conf.status || 'Booked',
            };
          });

        detailedBookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setBookings(detailedBookings);
      } catch (err) {
        setError('Failed to load service bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentVendor?.id]);

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
        Service Bookings
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '800px', width: '100%' }}>
        {loading ? (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Loading service bookings...
          </Typography>
        ) : error ? (
          <Typography variant="body1" align="center" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : bookings.length > 0 ? (
          <List>
            {bookings.map((booking, index) => (
              <Card key={booking.eventId + booking.customerId + booking.date} elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: '#fff', cursor: 'pointer' }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Service: ${booking.serviceName}`}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Customer: {booking.customerName}
                        </Typography>
                        {` — ${booking.serviceDescription}`}
                        <br/>
                        <FormControl size="small" sx={{ mt: 1, minWidth: 120 }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={booking.status}
                            label="Status"
                            onChange={e => {
                              const newStatus = e.target.value;
                              vendorManager.updateConfirmationStatus(
                                currentVendor.id,
                                booking.eventId,
                                booking.customerId,
                                newStatus
                              );
                              setBookings(prev => prev.map(b =>
                                b.eventId === booking.eventId && b.customerId === booking.customerId && b.date === booking.date
                                  ? { ...b, status: newStatus }
                                  : b
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
                          Confirmed on: {new Date(booking.timestamp).toLocaleString()}
                        </Typography>
                        {booking.date && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            Service Date: {booking.date}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < bookings.length - 1 && <Divider component="li" />}
              </Card>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            No new service bookings at the moment.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ServiceBookings; 