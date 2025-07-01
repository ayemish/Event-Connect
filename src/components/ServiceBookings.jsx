import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, MenuItem, Select, FormControl, InputLabel, Card } from '@mui/material';
import { getCurrentVendor, vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentsIcon from '@mui/icons-material/Payments';

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
        bgcolor: '#333446',
        p: 3,
        alignItems: 'center',
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        variant="contained"
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          bgcolor: '#7F8CAA',
          color: '#EAEFEF',
          fontWeight: 700,
          borderRadius: 2,
          boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
          '&:hover': {
            bgcolor: '#B8CFCE',
            color: '#333446',
          },
          letterSpacing: 1,
          zIndex: 10
        }}
      >
        Back to Dashboard
      </Button>
      <Button
        startIcon={<PaymentsIcon />}
        onClick={() => navigate('/payments')}
        variant="contained"
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          bgcolor: '#B8CFCE',
          color: '#333446',
          fontWeight: 700,
          borderRadius: 2,
          boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
          '&:hover': {
            bgcolor: '#EAEFEF',
            color: '#23243a',
          },
          letterSpacing: 1,
          zIndex: 10
        }}
      >
        Payments
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 900,
            letterSpacing: 2,
            color: '#EAEFEF',
            textShadow: '0 4px 24px #333446',
            mb: 4,
            fontSize: { xs: '2.2rem', md: '2.8rem' },
            px: 2,
            py: 1,
            borderRadius: 2,
            background: 'none',
          }}
        >
          Service Bookings
        </Typography>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
        `}</style>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '800px', width: '100%', bgcolor: '#23243a', color: '#EAEFEF' }}>
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
              <Card key={booking.eventId + booking.customerId + booking.date} elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: '#333446', color: '#EAEFEF', boxShadow: '0 4px 16px 0 rgba(51,52,70,0.10)', cursor: 'pointer' }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<Typography variant="h6" sx={{ color: '#B8CFCE', fontWeight: 700, letterSpacing: 1 }}>{`Service: ${booking.serviceName}`}</Typography>}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline', color: '#EAEFEF' }}
                          component="span"
                          variant="body2"
                        >
                          Customer: {booking.customerName}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ color: '#B8CFCE', display: 'inline' }}>
                          {` — ${booking.serviceDescription}`}
                        </Typography>
                        <br/>
                        <FormControl size="small" sx={{ mt: 1, minWidth: 120, '& .MuiInputBase-root': { color: '#333446', bgcolor: '#EAEFEF' }, '& .MuiInputLabel-root': { color: '#7F8CAA' } }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={booking.status}
                            label="Status"
                            onChange={e => {
                              const newStatus = e.target.value;
                              vendorManager.updateConfirmationStatus(
                                currentVendor.id,
                                booking.confirmationId,
                                newStatus
                              );
                              setBookings(prev => prev.map(b =>
                                b.eventId === booking.eventId && b.customerId === booking.customerId && b.date === booking.date
                                  ? { ...b, status: newStatus }
                                  : b
                              ));
                            }}
                            onClick={e => e.stopPropagation()}
                            sx={{ bgcolor: '#EAEFEF', color: '#333446', borderRadius: 1 }}
                          >
                            <MenuItem value="Pending" sx={{ color: '#333446' }}>Pending</MenuItem>
                            <MenuItem value="Booked" sx={{ color: '#333446' }}>Booked</MenuItem>
                            <MenuItem value="Ongoing" sx={{ color: '#333446' }}>Ongoing</MenuItem>
                            <MenuItem value="Completed" sx={{ color: '#333446' }}>Completed</MenuItem>
                          </Select>
                        </FormControl>
                        <br/>
                        <Typography variant="caption" sx={{ color: '#B8CFCE' }}>
                          Confirmed on: {new Date(booking.timestamp).toLocaleString()}
                        </Typography>
                        {booking.date && (
                          <Typography variant="caption" sx={{ ml: 2, color: '#B8CFCE' }}>
                            Service Date: {booking.date}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < bookings.length - 1 && <Divider component="li" sx={{ bgcolor: '#7F8CAA', opacity: 0.4 }} />}
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