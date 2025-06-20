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
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)'
        },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
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
            WebkitBoxOrient: 'vertical'
          }}
        >
          {packageData.name}
        </Typography>

        <Stack spacing={1} sx={{ mb: 1 }}>
          {packageData.vendorName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StorefrontIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {packageData.vendorName}
              </Typography>
            </Box>
          )}
          
          {packageData.category && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CategoryIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Chip 
                label={packageData.category}
                size="small"
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#bbdefb'
                  },
                  height: '24px'
                }}
              />
            </Box>
          )}

          {packageData.price && (
            <Typography variant="body2" color="text.secondary">
              Price: {packageData.price}
            </Typography>
          )}

        
        </Stack>

        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: '0.9rem',
              lineHeight: 1.4,
              minHeight: '3rem',
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
              bgcolor: isConfirmed ? '#28a745' : '#2c3e50',
              '&:hover': {
                bgcolor: isConfirmed ? '#218838' : '#34495e'
              },
              fontSize: '1rem',
              py: 1.5
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