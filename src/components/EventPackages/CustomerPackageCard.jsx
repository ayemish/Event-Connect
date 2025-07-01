import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, Typography, Box, Chip, Stack, Divider, Button, TextField, Alert } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { vendorManager } from '../../utils/vendorUtils';
import { useAuth } from '../../context/AuthContext';

const CustomerPackageCard = ({ packageData }) => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [warning, setWarning] = useState('');
  const { currentCustomer } = useAuth();

  const handleClick = () => {
    navigate(`/customer-package/${packageData.id}`);
  };

  const handleConfirmClick = (event) => {
    event.stopPropagation();
    navigate(`/confirm-event/${packageData.id}`);
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(51,52,70,0.3)'
        },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        bgcolor: '#333446',
        color: '#EAEFEF',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #7F8CAA',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3), 0 0 15px rgba(184,207,206,0.1)'
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="180"
        image={packageData.image}
        alt={packageData.name}
        sx={{ objectFit: 'cover' }}
      />
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom
          sx={{
            fontSize: '1.1rem',
            lineHeight: 1.3,
            height: '2.6rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: '#EAEFEF',
            fontWeight: 700
          }}
        >
          {packageData.name}
        </Typography>

        <Stack spacing={1} sx={{ mb: 1 }}>
          {packageData.vendorName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StorefrontIcon sx={{ fontSize: '1rem', color: '#B8CFCE' }} />
              <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>
                {packageData.vendorName}
              </Typography>
            </Box>
          )}
          
          {packageData.category && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CategoryIcon sx={{ fontSize: '1rem', color: '#B8CFCE' }} />
              <Chip 
                label={packageData.category}
                size="small"
                sx={{ 
                  backgroundColor: '#7F8CAA',
                  color: '#EAEFEF',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#B8CFCE',
                    color: '#333446'
                  },
                  height: '24px'
                }}
              />
            </Box>
          )}

          {packageData.price && (
            <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>
              Price: {packageData.price}
            </Typography>
          )}
        </Stack>

        <Divider sx={{ my: 1, borderColor: '#7F8CAA' }} />
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="body2" 
            sx={{
              color: '#EAEFEF',
              fontSize: '0.9rem',
              lineHeight: 1.4,
              maxHeight: '6rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {packageData.description || packageData.details}
          </Typography>
        </Box>
        {warning && <Alert severity="warning" sx={{ mb: 1 }}>{warning}</Alert>}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirmClick}
            sx={{
              bgcolor: isConfirmed ? '#28a745' : '#7F8CAA',
              color: isConfirmed ? '#EAEFEF' : '#23243a',
              fontWeight: 700,
              fontSize: '1rem',
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
              '&:hover': {
                bgcolor: isConfirmed ? '#218838' : '#B8CFCE',
                color: '#23243a'
              }
            }}
            startIcon={isConfirmed ? <CheckCircleOutlineIcon /> : <EventNoteIcon />}
          >
            {isConfirmed ? 'Confirmed!' : 'Confirm Event'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default CustomerPackageCard; 