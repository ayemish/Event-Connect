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
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#333446',
        p: 3,
        alignItems: 'center',
      }}
    >

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
          Send Invitations
        </Typography>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
        `}</style>
      </Box>
      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '800px', width: '100%', bgcolor: '#23243a', color: '#EAEFEF' }}>
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
              <Card key={inv.eventId + inv.customerId + inv.date} elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: '#333446', color: '#EAEFEF', boxShadow: '0 4px 16px 0 rgba(51,52,70,0.10)' }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<>
                      <Typography variant="h6" sx={{ color: '#B8CFCE', fontWeight: 700, letterSpacing: 1 }}>Event: {inv.eventName}</Typography>
                      <Typography variant="body2" sx={{ color: '#EAEFEF' }}>Customer: {inv.customerName}</Typography>
                      <Typography variant="body2" sx={{ color: '#EAEFEF' }}>Invitation List:</Typography>
                      {inv.invitees.split(',').map((email, i) => (
                        <Chip key={i} label={email.trim()} sx={{ m: 0.5, bgcolor: '#23243a', color: '#B8CFCE' }} />
                      ))}
                    </>}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline', color: '#EAEFEF' }}
                          component="span"
                          variant="body2"
                        >
                          Customer: {inv.customerName}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ color: '#B8CFCE', display: 'inline' }}>
                          {` — ${inv.eventDescription}`}
                        </Typography>
                        <br/>
                        <Box>
                          <FormControl size="small" sx={{ mt: 1, minWidth: 120, '& .MuiInputBase-root': { color: '#333446', bgcolor: '#EAEFEF' }, '& .MuiInputLabel-root': { color: '#7F8CAA' } }}>
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
                              sx={{ bgcolor: '#EAEFEF', color: '#333446', borderRadius: 1 }}
                            >
                              <MenuItem value="Pending" sx={{ color: '#333446' }}>Pending</MenuItem>
                              <MenuItem value="Booked" sx={{ color: '#333446' }}>Booked</MenuItem>
                              <MenuItem value="Ongoing" sx={{ color: '#333446' }}>Ongoing</MenuItem>
                              <MenuItem value="Completed" sx={{ color: '#333446' }}>Completed</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <br/>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#B8CFCE' }}>
                            Confirmed on: {new Date(inv.timestamp).toLocaleString()}
                          </Typography>
                          {inv.date && (
                            <Typography variant="caption" sx={{ ml: 2, color: '#B8CFCE' }}>
                              Event Date: {inv.date}
                            </Typography>
                          )}
                        </Box>
                      </>
                    }
                  />
                  <Button
                    variant="contained"
                    sx={{
                      ml: 2,
                      bgcolor: '#7F8CAA',
                      color: '#EAEFEF',
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
                      '&:hover': {
                        bgcolor: '#B8CFCE',
                        color: '#333446',
                      },
                      letterSpacing: 1
                    }}
                    onClick={() => handleSendInvitations(inv)}
                  >
                    Send 
                  </Button>
                </ListItem>
                {idx < invitations.length - 1 && <Divider component="li" sx={{ bgcolor: '#7F8CAA', opacity: 0.4 }} />}
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