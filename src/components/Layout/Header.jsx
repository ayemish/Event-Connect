import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentVendor, vendorManager } from '../../utils/vendorUtils';
import PaymentsIcon from '@mui/icons-material/Payments';

const Header = () => {
  const navigate = useNavigate();
  const vendor = getCurrentVendor();
  const location = useLocation();
  const showBackToDashboard = location.pathname !== '/dashboard';

  const handleSignOut = () => {
    localStorage.removeItem('vendor'); // Clear current vendor session
    window.location.href = '/'; // Hard redirect to landing page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        p: { xs: 1, md: 2 },
        bgcolor: '#23243a',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        gap: { xs: 1, md: 0 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: { xs: 1, md: 0 } }}>
        <Typography variant="h5" component="div">
          Vendor Dashboard
        </Typography>
        {showBackToDashboard && (
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
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
        {vendor && (
          <Typography variant="body1">
            Welcome, {vendor.businessName}
          </Typography>
        )}
        <Button 
          variant="outlined" 
          onClick={handleSignOut}
          sx={{
            border: '2px solid white',
            color: 'white',
            borderRadius: 2,
            minWidth: 150,
            fontWeight: 600,
            background: 'transparent',
            '&:hover': {
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid #fff',
              color: 'white',
            }
          }}
        >
          Sign Out
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/vendor-feedback')}
          sx={{
            border: '2px solid white',
            color: 'white',
            borderRadius: 2,
            minWidth: 150,
            fontWeight: 600,
            background: 'transparent',
            '&:hover': {
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid #fff',
              color: 'white',
            }
          }}
        >
          View All Feedback
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/notifications')}
          sx={{
            border: '2px solid white',
            color: 'white',
            borderRadius: 2,
            minWidth: 150,
            fontWeight: 600,
            background: 'transparent',
            '&:hover': {
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid #fff',
              color: 'white',
            }
          }}
        >
          Event Bookings
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/service-bookings')}
          sx={{
            border: '2px solid white',
            color: 'white',
            borderRadius: 2,
            minWidth: 150,
            fontWeight: 600,
            background: 'transparent',
            '&:hover': {
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid #fff',
              color: 'white',
            }
          }}
        >
          Service Bookings
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/send-invitations')}
          sx={{
            border: '2px solid white',
            color: 'white',
            borderRadius: 2,
            minWidth: 150,
            fontWeight: 600,
            background: 'transparent',
            '&:hover': {
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid #fff',
              color: 'white',
            }
          }}
        >
          Send Invitations
        </Button>
        <Button
          variant="outlined"
          startIcon={<PaymentsIcon />}
          onClick={() => navigate('/payments')}
          sx={{
            border: '2px solid white',
            color: 'white',
            borderRadius: 2,
            minWidth: 150,
            fontWeight: 600,
            background: 'transparent',
            '&:hover': {
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid #fff',
              color: 'white',
            }
          }}
        >
          Payments
        </Button>
      </Box>
    </Box>
  );
};

export default Header;