import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';

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
              });
            }
          }
        });
      }
    });
    setConfirmedEvents(myEvents.sort((a, b) => new Date(b.confirmedAt) - new Date(a.confirmedAt)));
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
        My Events
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '800px', width: '100%' }}>
        {confirmedEvents.length > 0 ? (
          <List>
            {confirmedEvents.map((event, idx) => (
              <React.Fragment key={event.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="h6">{event.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Vendor: {event.vendorName}
                        </Typography>
                        <Chip
                          label={event.status}
                          color={statusColors[event.status] || 'default'}
                          sx={{ fontWeight: 600, fontSize: '1rem', px: 2, mt: 1 }}
                        />
                      </>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">{event.description}</Typography>
                        {event.date && (
                          <Typography variant="caption" color="text.secondary">
                            Event Date: {event.date}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Confirmed on: {new Date(event.confirmedAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {idx < confirmedEvents.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography align="center" sx={{ mt: 2 }}>
            You have not confirmed any events yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default MyEvents; 