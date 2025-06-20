import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

const CustomerHeader = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Customer Dashboard
        </Typography>
        <IconButton color="inherit" onClick={() => navigate('/customer-notifications')}>
          <NotificationsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default CustomerHeader; 