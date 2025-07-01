import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/');
  };
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#23243a',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            color: '#EAEFEF',
            fontFamily: 'Playfair Display, serif',
            fontWeight: 600,
            mr: 2
          }}
        >
          Customer Dashboard
        </Typography>
        {location.pathname !== '/customer-dashboard' && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/customer-dashboard')}
            variant="outlined"
            sx={{
              borderColor: '#B8CFCE',
              color: '#B8CFCE',
              fontWeight: 600,
              px: 2,
              py: 1,
              borderRadius: 2,
              mr: 2,
              '&:hover': {
                borderColor: '#EAEFEF',
                bgcolor: '#7F8CAA',
                color: '#EAEFEF'
              }
            }}
          >
            Back to Dashboard
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          sx={{ 
            borderColor: '#B8CFCE',
            color: '#B8CFCE',
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: 2,
            mr: 1,
            '&:hover': {
              borderColor: '#EAEFEF',
              bgcolor: '#7F8CAA',
              color: '#EAEFEF'
            }
          }}
          onClick={() => navigate('/my-booked-services')}
        >
          My Services
        </Button>
        <Button
          variant="outlined"
          sx={{ 
            borderColor: '#B8CFCE',
            color: '#B8CFCE',
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: 2,
            mr: 1,
            '&:hover': {
              borderColor: '#EAEFEF',
              bgcolor: '#7F8CAA',
              color: '#EAEFEF'
            }
          }}
          onClick={() => navigate('/my-events')}
        >
          My Events
        </Button>
        <IconButton 
          color="inherit" 
          onClick={() => navigate('/customer-notifications')}
          sx={{
            color: '#B8CFCE',
            border: '1.5px solid #B8CFCE',
            borderRadius: 2,
            mr: 1,
            px: 1.5,
            py: 1,
            '&:hover': {
              bgcolor: '#7F8CAA',
              color: '#EAEFEF',
              borderColor: '#EAEFEF'
            }
          }}
        >
          <NotificationsIcon />
        </IconButton>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleLogout}
          sx={{ 
            borderColor: '#B8CFCE',
            color: '#B8CFCE',
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              borderColor: '#EAEFEF',
              bgcolor: '#7F8CAA',
              color: '#EAEFEF'
            }
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CustomerHeader; 