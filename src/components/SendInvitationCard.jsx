import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentVendor, vendorManager } from '../utils/vendorUtils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Divider from '@mui/material/Divider';
import emailjs from 'emailjs-com';

const SendInvitationCard = () => {
  const { eventId, customerId, date } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const currentVendor = getCurrentVendor();

  useEffect(() => {
    if (!currentVendor || !currentVendor.id) {
      setError('No vendor session found');
      setLoading(false);
      return;
    }
    const vendorConfirmations = vendorManager.getVendorConfirmations(currentVendor.id);
    const vendorEvents = vendorManager.getVendorContent(currentVendor.id)?.events || [];
    const conf = vendorConfirmations.find(
      c => c.eventId === eventId && c.customerId === customerId && c.date === date
    );
    if (!conf) {
      setError('Invitation not found');
      setLoading(false);
      return;
    }
    const event = vendorEvents.find(e => e.id === conf.eventId);
    setInvitation({
      ...conf,
      eventName: event ? event.name : 'Unknown Event',
      eventDescription: event ? event.description : 'N/A',
    });
    setLoading(false);
  }, [eventId, customerId, date]);

  const handleSend = async () => {
    setSending(true);
    setErrorMsg('');
    try {
      const emails = invitation.invitees.split(',').map(e => e.trim()).filter(Boolean);
      // Build the HTML invitation card as a string
      const inviteCardHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation Card</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Dancing+Script:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <div style="font-family: 'Playfair Display', serif; background: #f8fafc; border-radius: 12px; border: 2px solid #e0eafc; padding: 32px; max-width: 400px; margin: auto;">
        <h1 style="font-family: 'Dancing Script', cursive; color: #7b2ff2; text-align: center; font-size: 2.5rem; margin-bottom: 8px;">Invitation</h1>
        <hr style="border: 1.5px solid #7b2ff2; width: 60%; margin: 16px auto;">
        <h2 style="text-align: center; color: #222; font-size: 2rem; margin-bottom: 8px;">${invitation.eventName}</h2>
        <h3 style="text-align: center; color: #7b2ff2; font-family: 'Dancing Script', cursive; font-size: 1.5rem; margin-bottom: 16px;">by ${invitation.customerName}</h3>
        <p style="text-align: center; font-weight: 500; font-size: 1.1rem; margin-bottom: 12px;">You are invited!</p>
        <div style="text-align: center; margin-bottom: 16px;">
            <span style="display: inline-block; background: #f8e1f4; color: #7b2ff2; font-weight: 600; border: 1px solid #e0eafc; border-radius: 16px; padding: 6px 16px; margin: 2px; font-family: 'Playfair Display', serif; font-size: 1rem;">Join us for celebration!</span>
        </div>
        <p style="text-align: center; color: #7b2ff2; font-weight: 600; font-size: 1.2rem;">on ${invitation.date}</p>
    </div>
</body>
</html>
`;
      for (const to_email of emails) {
        await emailjs.send(
          'service_1cw3k9j',
          'template_xqy3i3j',
          {
            to_email,
            invite_card_html: inviteCardHtml,
          },
          'biY0mjqmrDFr5JOrI'
        );
      }
      setSent(true);
      alert('Invitations sent!');
    } catch (err) {
      setErrorMsg('Failed to send some or all invitations. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <Typography align="center" sx={{ mt: 4 }}>Loading invitation...</Typography>;
  }
  if (error) {
    return <Typography align="center" color="error" sx={{ mt: 4 }}>{error}</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/send-invitations')}
        variant="contained"
        sx={{ mb: 3, bgcolor: '#2c3e50', '&:hover': { bgcolor: '#34495e' } }}
      >
        Back to Invitations List
      </Button>
      <Paper elevation={8} sx={{
        p: 5,
        maxWidth: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 6,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '2px solid #e0eafc',
        background: 'linear-gradient(135deg, #fff 60%, #e0eafc 100%)',
        position: 'relative',
      }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 1,
            fontWeight: 700,
            fontFamily: 'Dancing Script, cursive',
            color: '#7b2ff2',
            letterSpacing: 2,
            fontSize: { xs: '2.2rem', sm: '2.8rem' },
          }}
        >
          Invitation
        </Typography>
        <Divider sx={{ width: '60%', mb: 3, borderColor: '#7b2ff2', borderBottomWidth: 3, borderRadius: 2 }} />
        <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 600, color: '#222', fontFamily: 'Playfair Display, serif' }}>
          {invitation.eventName}
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 2, fontStyle: 'italic', color: '#7b2ff2', fontFamily: 'Dancing Script, cursive', fontSize: '1.5rem' }}>
          by {invitation.customerName}
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 1, fontWeight: 500, color: '#444' }}>
          Invitation List:
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {invitation.invitees.split(',').map((email, i) => (
            <Chip
              key={i}
              label={email.trim()}
              sx={{
                m: 0.5,
                fontSize: '1rem',
                bgcolor: '#f8e1f4',
                color: '#7b2ff2',
                fontWeight: 600,
                border: '1px solid #e0eafc',
                fontFamily: 'Playfair Display, serif',
              }}
            />
          ))}
        </Box>
        {invitation.date && (
          <Typography variant="subtitle2" align="center" color="#7b2ff2" sx={{ mb: 2, fontWeight: 600, fontSize: '1.2rem', letterSpacing: 1 }}>
            on {invitation.date}
          </Typography>
        )}
        <Button
          variant="contained"
          color={sent ? 'success' : 'primary'}
          onClick={handleSend}
          disabled={sent || sending}
          sx={{ mt: 2, px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 3, boxShadow: '0 2px 8px #7b2ff233' }}
        >
          {sending ? 'Sending...' : sent ? 'Invitations Sent' : 'Confirm & Send Invitations'}
        </Button>
        {errorMsg && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>{errorMsg}</Typography>
        )}
      </Paper>
      {/* Google Fonts for script and serif */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:wght@600&display=swap');
      `}</style>
      {/*
        EmailJS Integration Instructions:
        1. In your EmailJS template, set the body type to 'HTML' and use the variable {{{invite_card_html}}} as the main content.
        2. The invite card will be sent as a styled HTML email to each invitee.
        3. You can still use other variables (event_name, customer_name, event_date, etc.) if you want.
      */}
    </Box>
  );
};

export default SendInvitationCard; 