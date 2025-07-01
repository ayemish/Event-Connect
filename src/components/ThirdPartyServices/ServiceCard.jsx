import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, Typography, Box, useTheme } from '@mui/material';

const ServiceCard = ({ eventId, service }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleCardClick = () => {
    if (eventId) {
      navigate(`/event/${eventId}/service/${service.id}`);
    } else {
      navigate(`/service/${service.id}`);
    }
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(51,52,70,0.3)'
        },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#333446',
        color: '#EAEFEF',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #7F8CAA',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3), 0 0 15px rgba(184,207,206,0.1)'
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        height="140"
        image={service.image || 'https://via.placeholder.com/150'}
        alt={service.name}
        sx={{ objectFit: 'cover' }}
      />
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom
          sx={{
            color: '#EAEFEF',
            fontWeight: 700,
            fontSize: '1.1rem',
            mb: 1
          }}
        >
          {service.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#B8CFCE',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          Price: Rs {service.price}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
         
        </Box>
      </Box>
    </Card>
  );
};

export default ServiceCard;