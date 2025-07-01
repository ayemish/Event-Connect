import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { getCurrentVendor, vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const navigate = useNavigate();

  // Only call getCurrentVendor inside useEffect!
  useEffect(() => {
    const vendor = getCurrentVendor();
    if (!vendor || !vendor.id) return;
    setVendorName(vendor.businessName || '');
    let vendorPayments = vendorManager.getVendorPayments(vendor.id);
    // Sort by timestamp descending (newest first)
    vendorPayments = vendorPayments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setPayments(vendorPayments);
    setLoading(false);
    // Fetch all events for this vendor
    const allData = vendorManager.getVendorContent(vendor.id);
    setAllEvents(allData?.events || []);
  }, []);

  useEffect(() => {
    const allVendors = vendorManager.getAllData();
    const services = [];
    Object.values(allVendors).forEach(vendorData => {
      if (vendorData.services && Array.isArray(vendorData.services)) {
        services.push(...vendorData.services);
      }
    });
    setAllServices(services);
  }, []);

  // Helper to get the true total cost for a payment
  const getTrueTotalCost = (payment) => {
    if (typeof payment.totalCost !== 'undefined') return Number(payment.totalCost);

    // Service-only booking
    if (payment.eventId && payment.eventId.startsWith('SERVICE_ONLY_')) {
      const serviceId = payment.selectedServices && payment.selectedServices[0];
      const service = allServices.find(s => s.id === serviceId);
      return service ? Number(service.price) : 0;
    }

    // Fallback for events
    const base = Number(payment.price) || 0;
    const add = Number(payment.additionalCost) || 0;
    return base + add;
  };
  const totalAmount = payments.reduce((sum, p) => sum + getTrueTotalCost(p), 0);

  // Helper to get the display name for event/service
  const getDisplayName = (payment) => {
    if (payment.eventId && payment.eventId.startsWith('SERVICE_ONLY_')) {
      // Service-only booking: get service name by ID
      const serviceId = payment.selectedServices && payment.selectedServices[0];
      const service = allServices.find(s => s.id === serviceId);
      return service ? service.name : payment.eventId;
    }
    // For event bookings, look up the event name
    const event = allEvents.find(e => e.id === payment.eventId);
    return event ? event.name : payment.eventId;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#333446', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        Payments {vendorName && `for ${vendorName}`}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mx: 'auto', width: '100%', bgcolor: '#23243a', color: '#EAEFEF', boxSizing: 'border-box', overflowX: 'visible' }}>
        {!loading && payments.length > 0 && (
          <Typography variant="h5" align="right" sx={{ color: '#B8CFCE', fontWeight: 700, mb: 2 }}>
            Total of All Events: <span style={{ color: '#EAEFEF' }}>{totalAmount}</span>
          </Typography>
        )}
        {loading ? (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Loading payments...
          </Typography>
        ) : payments.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            No payments found.
          </Typography>
        ) : (
          <TableContainer sx={{ width: '100%', overflowX: 'visible' }}>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Event/Service Name</TableCell>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Customer Name</TableCell>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Customized</TableCell>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Total Cost</TableCell>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Payment Status</TableCell>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Payment Method</TableCell>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Payment Date</TableCell>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Event Date</TableCell>
                  <TableCell sx={{ color: '#B8CFCE', fontWeight: 700 }}>Event Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.confirmationId}>
                    <TableCell sx={{ color: '#EAEFEF' }}>{getDisplayName(payment)}</TableCell>
                    <TableCell sx={{ color: '#EAEFEF' }}>{payment.customerName}</TableCell>
                    <TableCell>
                      {payment.isCustomized ? (
                        <Chip label="Yes" color="info" sx={{ fontWeight: 700, bgcolor: '#7F8CAA', color: '#EAEFEF' }} />
                      ) : (
                        <Chip label="No" color="default" sx={{ fontWeight: 700, bgcolor: '#333446', color: '#B8CFCE' }} />
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#EAEFEF' }}>{getTrueTotalCost(payment)}</TableCell>
                    <TableCell>
                      <Chip
                        label={payment.paymentStatus === 'Clear' ? 'Clear' : 'Pending'}
                        color={payment.paymentStatus === 'Clear' ? 'success' : 'warning'}
                        sx={{ fontWeight: 700, fontSize: '1rem', bgcolor: payment.paymentStatus === 'Clear' ? '#4caf50' : '#ff9800', color: '#EAEFEF' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#EAEFEF' }}>{payment.paymentMethod ? payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1) : '—'}</TableCell>
                    <TableCell sx={{ color: '#EAEFEF' }}>{payment.paymentTimestamp ? new Date(payment.paymentTimestamp).toLocaleDateString() : '—'}</TableCell>
                    <TableCell sx={{ color: '#EAEFEF' }}>{payment.date ? payment.date : '—'}</TableCell>
                    <TableCell sx={{ color: '#EAEFEF' }}>{payment.status ? payment.status : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Payments;