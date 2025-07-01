import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackToDashboardButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate('/customer-dashboard')}
      variant="contained"
      sx={{
        mb: 3,
        bgcolor: '#7F8CAA',
        color: '#EAEFEF',
        fontWeight: 700,
        borderRadius: 2,
        boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
        letterSpacing: 1,
        px: 3,
        py: 1.2,
        '&:hover': {
          bgcolor: '#B8CFCE',
          color: '#333446',
        },
      }}
    >
      Back to Dashboard
    </Button>
  );
};

export default BackToDashboardButton; 