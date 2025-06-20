import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCurrentVendor, vendorManager } from '../../utils/vendorUtils';

const Header = () => {
  const navigate = useNavigate();
  const vendor = getCurrentVendor();

  const handleSignOut = () => {
    localStorage.removeItem('vendor'); // Clear current vendor session
    window.location.href = '/'; // Hard redirect to landing page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: '#2c3e50',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Typography variant="h5" component="div">
        Dashboard
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          Event Booking
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
          Service Booking
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
      </Box>
    </Box>
  );
};

export default Header;