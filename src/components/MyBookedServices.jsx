import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ThirdPartyServices/ServiceCard';

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
              });
            }
          }
        });
      }
    });
    setBookedServices(myServices.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
  }, [currentCustomer]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', p: 3 }}>
      <Button variant="contained" sx={{ mb: 3 }} onClick={() => navigate('/customer-dashboard')}>
        Back to Dashboard
      </Button>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom
        sx={{
          color: '#2c3e50',
          fontWeight: 700,
          mb: 4,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(90deg, #e3f2fd 0%, #fff 100%)',
          boxShadow: '0 2px 8px rgba(44,62,80,0.04)'
        }}
      >
        My Booked Services
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '800px', width: '100%' }}>
        {bookedServices.length > 0 ? (
          <List>
            {bookedServices.map((service, idx) => (
              <React.Fragment key={service.id + service.bookedAt}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="h6">{service.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Vendor: {service.vendorName}
                        </Typography>
                        <Chip
                          label={service.status}
                          color={statusColors[service.status] || 'default'}
                          sx={{ fontWeight: 600, fontSize: '1rem', px: 2, mt: 1 }}
                        />
                      </>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">{service.description}</Typography>
                        {service.bookingDate && (
                          <Typography variant="caption" color="text.secondary">
                            Service Date: {service.bookingDate}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Booked on: {new Date(service.bookedAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {idx < bookedServices.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography align="center" sx={{ mt: 2 }}>
            You have not booked any services yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default MyBookedServices; 