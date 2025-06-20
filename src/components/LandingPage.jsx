import React from 'react';
import { Box, Button, Typography, Container, useTheme, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleVendorClick = () => {
    navigate('/vendor-login');
  };

  const handleCustomerClick = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #333446 0%, #7F8CAA 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: '#333446',
        textAlign: 'center',
        p: 0,
        position: 'relative',
      }}
    >
      {/* Top Branding */}
      <Box sx={{ width: '100%', pt: 5, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EventAvailableIcon sx={{ fontSize: 60, color: '#7F8CAA', mb: 1, textShadow: '0 4px 16px #333446' }} />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            letterSpacing: 2,
            color: '#EAEFEF',
            textShadow: '0 4px 24px #333446',
            fontFamily: 'Playfair Display, serif',
            mb: 1,
          }}
        >
          EVENT CONNECT
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#B8CFCE',
            fontWeight: 400,
            mb: 2,
            fontFamily: 'Dancing Script, cursive',
            fontSize: '1.5rem',
          }}
        >
          Your one-stop platform for seamless event planning
        </Typography>
      </Box>
      {/* Glassmorphism Card */}
      <Container maxWidth="sm" sx={{ zIndex: 2 }}>
        <Paper elevation={8} sx={{
          p: 5,
          borderRadius: 6,
          background: 'rgba(234,239,239,0.85)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(51, 52, 70, 0.15)',
          mt: 2,
        }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333446', fontWeight: 700, mb: 2, letterSpacing: 1 }}>
            Welcome to Event Connect
          </Typography>
          <Typography variant="h6" component="p" gutterBottom sx={{ mb: 5, color: '#7F8CAA' }}>
            Are you a customer or a vendor?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCustomerClick}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.2rem',
                bgcolor: '#B8CFCE',
                color: '#333446',
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: '0 4px 16px #7F8CAA44',
                '&:hover': {
                  bgcolor: '#EAEFEF',
                  color: '#333446',
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s, background-color 0.2s',
              }}
            >
              I'm a Customer
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleVendorClick}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.2rem',
                bgcolor: '#7F8CAA',
                color: '#EAEFEF',
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: '0 4px 16px #33344644',
                '&:hover': {
                  bgcolor: '#333446',
                  color: '#EAEFEF',
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s, background-color 0.2s',
              }}
            >
              I'm a Vendor
            </Button>
          </Box>
        </Paper>
      </Container>
      {/* Decorative Wave */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1 }}>
        <svg viewBox="0 0 1440 320" width="100%" height="80" style={{ display: 'block' }}>
          <path fill="#EAEFEF" fillOpacity="0.7" d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,197.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </Box>
      {/* Google Fonts for Playfair Display and Dancing Script */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </Box>
  );
};

export default LandingPage; 