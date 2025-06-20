import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Card, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getCurrentVendor, vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const SendInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [sentInvites, setSentInvites] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentVendor = getCurrentVendor();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!currentVendor || !currentVendor.id) {
          setError('No vendor session found');
          return;
        }
        const vendorConfirmations = vendorManager.getVendorConfirmations(currentVendor.id);
        const vendorEvents = vendorManager.getVendorContent(currentVendor.id)?.events || [];
        if (!vendorConfirmations || vendorConfirmations.length === 0) {
          setInvitations([]);
          return;
        }
        const invitationList = vendorConfirmations
          .filter(conf => conf.invitees && conf.invitees.trim() !== '')
          .map(conf => {
            const event = vendorEvents.find(e => e.id === conf.eventId);
            return {
              ...conf,
              eventName: event ? event.name : 'Unknown Event',
              eventDescription: event ? event.description : 'N/A',
              customerName: conf.customerName || conf.customerId,
            };
          });
        setInvitations(invitationList);
      } catch (err) {
        setError('Failed to load invitations');
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, [currentVendor?.id]);

  const handleSendInvitations = useCallback((inv) => {
    navigate(`/send-invitations/${inv.eventId}/${inv.customerId}/${inv.date}`);
  }, [navigate]);

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
        Send Invitations
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '800px', width: '100%' }}>
        {loading ? (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Loading invitations...
          </Typography>
        ) : error ? (
          <Typography variant="body1" align="center" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : invitations.length > 0 ? (
          <List>
            {invitations.map((inv, idx) => (
              <Card key={inv.eventId + inv.customerId + inv.date} elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: '#fff' }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<>
                      <Typography variant="h6">Event: {inv.eventName}</Typography>
                      <Typography variant="body2" color="text.secondary">Customer: {inv.customerName}</Typography>
                      <Typography variant="body2" color="text.secondary">Invitation List:</Typography>
                      {inv.invitees.split(',').map((email, i) => (
                        <Chip key={i} label={email.trim()} sx={{ m: 0.5 }} />
                      ))}
                    </>}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Customer: {inv.customerName}
                        </Typography>
                        {` — ${inv.eventDescription}`}
                        <br/>
                        <Box>
                          <FormControl size="small" sx={{ mt: 1, minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={typeof inv.status === 'string' ? inv.status : 'Booked'}
                              label="Status"
                              onChange={e => {
                                const newStatus = e.target.value;
                                vendorManager.updateConfirmationStatus(
                                  currentVendor.id,
                                  inv.eventId,
                                  inv.customerId,
                                  newStatus
                                );
                                setInvitations(prev => prev.map(n =>
                                  n.eventId === inv.eventId && n.customerId === inv.customerId && n.date === inv.date
                                    ? { ...n, status: newStatus }
                                    : n
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
                        </Box>
                        <br/>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Confirmed on: {new Date(inv.timestamp).toLocaleString()}
                          </Typography>
                          {inv.date && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                              Event Date: {inv.date}
                            </Typography>
                          )}
                        </Box>
                      </>
                    }
                  />
                  <Button
                    variant="contained"
                    color={sentInvites[inv.eventId + inv.customerId + inv.date] ? 'success' : 'primary'}
                    onClick={() => handleSendInvitations(inv)}
                    sx={{ ml: 2 }}
                  >
                    Send Invitations
                  </Button>
                </ListItem>
                {idx < invitations.length - 1 && <Divider component="li" />}
              </Card>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            No invitations to send at the moment.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SendInvitations; 