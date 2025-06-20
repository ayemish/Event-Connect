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
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)'
        },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
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
        <Typography variant="h6" component="div" gutterBottom>
          {service.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: {service.price}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Status: <span style={{ color: service.status === 'active' ? theme.palette.success.main : theme.palette.error.main }}>{service.status}</span>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ServiceCard;